import CourtCase from "../../../src/services/entities/CourtCase"
import { DataSource, IsNull } from "typeorm"
import PromiseResult from "../../../src/types/PromiseResult"
import { isError } from "../../../src/types/Result"
import { getAuditLogRecord } from "./getAuditLogRecord"
import generateAuditLogEvents from "./generateAuditLogEvents"
import updateAuditLogRecord from "./updateAuditLogRecord"
import getCourtCase from "../../../src/services/getCourtCase"
import updateTriggers from "./updateTriggers"
import addNotes from "./addNotes"
import logAction from "./logAction"

export default function resolveCaseTriggers(
  pgDataSource: DataSource,
  dynamoDbClient: AWS.DynamoDB.DocumentClient,
  courtCaseId: number,
  resolverUsername: string,
  triggerCodesToResolve: string[]
): PromiseResult<void> {
  return pgDataSource
    .transaction("SERIALIZABLE", async (entityManager) => {
      // Get court case
      logAction(courtCaseId, "Invoking getCourtCase")
      const courtCase = await getCourtCase(entityManager, courtCaseId)
      if (isError(courtCase)) {
        logAction(courtCaseId, "resolveCaseTriggers failed", courtCase)
        throw courtCase
      }
      if (!courtCase) {
        logAction(courtCaseId, "resolveCaseTriggers failed (Court case not found)")
        throw Error(`Court case not found: ${courtCaseId}`)
      }
      logAction(courtCaseId, "Invoked resolveCaseTriggers")

      const { triggers } = courtCase
      if (triggers.length === 0) {
        logAction(courtCaseId, "Court case has no triggers")
        throw Error(`Court case has no triggers: ${courtCaseId}`)
      }

      const triggersToResolve = triggers.filter(
        (trigger) => !trigger.resolvedAt && !trigger.resolvedBy && triggerCodesToResolve.includes(trigger.triggerCode)
      )

      if (triggersToResolve.length === 0) {
        logAction(courtCaseId, "Court case has no trigger to resolve")
        throw Error(`Court case has no trigger to resolve: ${courtCaseId}`)
      }

      const otherTriggers = triggers.filter(
        (trigger) => !trigger.resolvedAt && !trigger.resolvedBy && !triggerCodesToResolve.includes(trigger.triggerCode)
      )

      logAction(
        courtCaseId,
        `Court case has ${triggersToResolve.length} triggers to resolve and ${otherTriggers.length} other remaining triggers`
      )

      // Resolve triggers
      logAction(courtCaseId, "Invoking updateTriggers")
      await updateTriggers(
        entityManager,
        courtCaseId,
        triggersToResolve.map((t) => t.triggerId),
        resolverUsername
      )
      logAction(courtCaseId, "Invoked updateTriggers")

      // Add notes
      logAction(courtCaseId, "Invoking addNotes")
      await addNotes(entityManager, courtCaseId, triggerCodesToResolve, triggersToResolve)
      logAction(courtCaseId, "Invoked addNotes")

      // Update the court case record if all triggers are resolved
      if (otherTriggers.length === 0) {
        logAction(courtCaseId, "All triggers are resolved. Updating the court case")
        const updateCaseResult = await entityManager
          .getRepository(CourtCase)
          .update(
            {
              errorId: courtCaseId,
              triggerResolvedBy: IsNull(),
              triggerResolvedTimestamp: IsNull()
            },
            { triggerResolvedBy: resolverUsername, triggerResolvedTimestamp: new Date(), triggerStatus: "Resolved" }
          )
          .catch((error: Error) => error)

        if (isError(updateCaseResult)) {
          logAction(courtCaseId, "All triggers are resolved. Failed to update the court case", updateCaseResult)
          throw updateCaseResult
        }
        logAction(courtCaseId, "All triggers are resolved. Updated the court case")
      }

      // Generate audit log events / lookup values
      logAction(courtCaseId, "Invoking generateAuditLogEvents")
      const newAuditLogEvents = generateAuditLogEvents(
        triggersToResolve,
        triggerCodesToResolve,
        courtCase.messageId,
        courtCase.hearingOutcome,
        resolverUsername
      )
      logAction(courtCaseId, "Invoked generateAuditLogEvents")

      // Get audit log record
      logAction(courtCaseId, `Invoking getAuditLogRecord ${courtCase.messageId}`)
      const auditLog = await getAuditLogRecord(dynamoDbClient, courtCase.messageId, courtCaseId)
      logAction(courtCaseId, `Invoked getAuditLogRecord ${courtCase.messageId}`)

      // Update audit log record with new events / lookup values
      logAction(courtCaseId, "Invoking updateAuditLogRecord")
      await updateAuditLogRecord(dynamoDbClient, auditLog, newAuditLogEvents.events, newAuditLogEvents.valueLookup)
      logAction(courtCaseId, "Invoked updateAuditLogRecord")
    })
    .catch((error: Error) => error)
}
