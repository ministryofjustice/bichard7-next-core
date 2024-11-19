import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type Trigger from "services/entities/Trigger"
import type { DataSource, EntityManager } from "typeorm"

import { faker } from "@faker-js/faker"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import serialiseToXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import { randomUUID } from "crypto"
import { subYears } from "date-fns"
import sample from "lodash.sample"

import type { Result } from "../../src/types/Result"

import CourtCase from "../../src/services/entities/CourtCase"
import { isError } from "../../src/types/Result"
import createDummyAsn from "./createDummyAsn"
import createDummyCourtCode from "./createDummyCourtCode"
import createDummyExceptions from "./createDummyExceptions"
import createDummyNotes from "./createDummyNotes"
import createDummyPtiurn from "./createDummyPtiurn"
import createDummyTriggers from "./createDummyTriggers"
import randomDate from "./createRandomDate"
import generateAho from "./generateAho"

const randomBoolean = (): boolean => sample([true, false]) ?? true

const randomUsername = (): string =>
  `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}`.slice(0, 31)

const randomName = (): string => `${faker.person.lastName().toUpperCase()} ${faker.person.firstName()}`.slice(0, 31)

export default async (
  dataSource: DataSource | EntityManager,
  caseId: number,
  orgCode: string,
  ahoTemplate: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<CourtCase> => {
  const firstName = `${faker.person.firstName().toUpperCase()}`
  const lastName = `${faker.person.lastName().toUpperCase()}`
  const courtName = faker.location.city()

  const caseDate = randomDate(dateFrom || subYears(new Date(), 1), dateTo || new Date())
  const ptiurn = createDummyPtiurn(caseDate.getFullYear(), orgCode + faker.string.alpha(2).toUpperCase())
  const isResolved = randomBoolean()
  const resolutionDate = isResolved ? randomDate(caseDate, dateTo || new Date()) : null

  let triggers: Trigger[]
  let triggersExist: boolean
  const magicNumberForIncludingEmptyTriggers = 25
  if (caseId % magicNumberForIncludingEmptyTriggers === 0) {
    triggers = []
    triggersExist = false
  } else {
    triggers = createDummyTriggers(dataSource, caseId, caseDate, dateTo || new Date(), isResolved)
    triggersExist = true
  }

  const hasUnresolvedTriggers = triggers.filter((trigger) => trigger.status === "Unresolved").length > 0

  const randomisedAho = generateAho({ ahoTemplate, courtName, firstName, lastName, ptiurn })

  const parsedAho: Result<AnnotatedHearingOutcome> = parseAhoXml(randomisedAho)

  if (isError(parsedAho)) {
    console.log("Missing or invalid AHO")
    throw parsedAho
  }

  const notes = createDummyNotes(dataSource, caseId, triggers, isResolved)
  const { ahoWithExceptions, errorReason, errorReport, exceptionCount } = createDummyExceptions(
    hasUnresolvedTriggers,
    parsedAho
  )
  const hasExceptions = exceptionCount > 0

  let ahoWithExceptionsXml

  if (ahoWithExceptions) {
    ahoWithExceptionsXml = serialiseToXml(ahoWithExceptions)
  }

  const courtCase = await dataSource.getRepository(CourtCase).save({
    asn: createDummyAsn(caseDate.getFullYear(), orgCode + faker.string.alpha(2).toUpperCase()),
    courtCode: createDummyCourtCode(orgCode),
    courtDate: caseDate,
    courtName: courtName,
    courtReference: ptiurn,
    courtRoom: Math.round(Math.random() * 15)
      .toString()
      .padStart(2, "0"),
    createdTimestamp: caseDate,
    defendantName: `${firstName} ${lastName}`,
    errorCount: exceptionCount,
    errorId: caseId,
    errorInsertedTimestamp: caseDate,
    errorLockedByUsername: !isResolved && hasExceptions && randomBoolean() ? randomUsername() : null,
    errorQualityChecked: 1,
    errorReason: errorReason,
    errorReport: errorReport,
    errorResolvedBy: isResolved ? randomName() : null,
    errorResolvedTimestamp: isResolved ? resolutionDate : null,
    errorStatus: exceptionCount === 0 ? null : !isResolved && hasExceptions ? "Unresolved" : "Resolved",
    hearingOutcome: errorReport
      ? ahoWithExceptionsXml
      : generateAho({ ahoTemplate, courtName, firstName, lastName, ptiurn }),
    isUrgent: randomBoolean(),
    messageId: randomUUID(),
    messageReceivedTimestamp: caseDate,
    notes: notes,
    orgForPoliceFilter: orgCode,
    phase: 1,
    pncUpdateEnabled: "Y",
    ptiurn: ptiurn,
    resolutionTimestamp: resolutionDate,
    triggerCount: triggers.length,
    triggerInsertedTimestamp: caseDate,
    triggerLockedByUsername:
      !isResolved && hasUnresolvedTriggers && randomBoolean() && triggersExist ? randomUsername() : null,
    triggerQualityChecked: 1,
    triggerReason: triggers.length > 0 ? triggers[0].triggerCode : null,
    triggerResolvedBy: (isResolved && triggersExist) || (triggersExist && !hasUnresolvedTriggers) ? randomName() : null,
    triggerResolvedTimestamp:
      (isResolved && triggersExist) || (triggersExist && !hasUnresolvedTriggers) ? new Date() : null,
    triggers: triggers,
    triggerStatus: triggers.length === 0 ? null : hasUnresolvedTriggers ? "Unresolved" : "Resolved",
    userUpdatedFlag: randomBoolean() ? 1 : 0
  })

  return courtCase
}
