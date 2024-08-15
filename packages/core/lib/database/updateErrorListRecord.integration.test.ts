import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import postgres from "postgres"
import generateMockPhase2Result from "../../phase1/tests/helpers/generateMockPhase2Result"
import type ErrorListRecord from "../../types/ErrorListRecord"
import ResolutionStatus from "../../types/ResolutionStatus"
import errorPaths from "../exceptions/errorPaths"
import insertErrorListRecord from "./insertErrorListRecord"
import updateErrorListRecord from "./updateErrorListRecord"

const dbConfig = createDbConfig()
const db = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

const snapshotExclusions = {
  error_id: expect.any(Number),
  trigger_insert_ts: expect.any(Date),
  msg_received_ts: expect.any(Date),
  error_insert_ts: expect.any(Date),
  create_ts: expect.any(Date),
  annotated_msg: expect.any(String),
  updated_msg: expect.any(String),
  message_id: expect.any(String)
}

describe("updateErrorListRecord", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
  })

  const testInputs = [
    { beforeStatus: null, exceptionsGenerated: false, expectedStatus: null },
    { beforeStatus: null, exceptionsGenerated: true, expectedStatus: ResolutionStatus.UNRESOLVED },
    {
      beforeStatus: ResolutionStatus.UNRESOLVED,
      exceptionsGenerated: true,
      expectedStatus: ResolutionStatus.UNRESOLVED
    },
    {
      beforeStatus: ResolutionStatus.UNRESOLVED,
      exceptionsGenerated: false,
      expectedStatus: ResolutionStatus.RESOLVED
    },
    {
      beforeStatus: ResolutionStatus.SUBMITTED,
      exceptionsGenerated: false,
      expectedStatus: ResolutionStatus.RESOLVED
    },
    {
      beforeStatus: ResolutionStatus.SUBMITTED,
      exceptionsGenerated: true,
      expectedStatus: ResolutionStatus.UNRESOLVED
    },
    { beforeStatus: ResolutionStatus.RESOLVED, exceptionsGenerated: true, expectedStatus: ResolutionStatus.UNRESOLVED },
    { beforeStatus: ResolutionStatus.RESOLVED, exceptionsGenerated: false, expectedStatus: ResolutionStatus.RESOLVED }
  ]

  testInputs.forEach(({ beforeStatus, exceptionsGenerated, expectedStatus }) => {
    const beforeStatusText = beforeStatus ? ResolutionStatus[beforeStatus] : "NULL"
    const expectedStatusText = expectedStatus ? ResolutionStatus[expectedStatus] : "NULL"
    const exceptionsText = exceptionsGenerated ? "generated" : "not generated"

    it(`should update the record and update error_status from ${beforeStatusText} to ${expectedStatusText} when exceptions ${exceptionsText}`, async () => {
      const result = generateMockPhase2Result()
      const recordId = await insertErrorListRecord(db, result)
      await db`UPDATE br7own.error_list SET error_status = ${beforeStatus}::integer WHERE error_id = ${recordId}`

      result.outputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "new_asn"
      result.outputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN = "new_ptiurn"
      result.outputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner!.SecondLevelCode = "99"
      if (exceptionsGenerated) {
        result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      }

      await updateErrorListRecord(db, recordId, result)

      const updatedRecord = (
        await db<ErrorListRecord[]>`
        SELECT * FROM br7own.error_list WHERE error_id = ${recordId}`
      )[0]

      expect(updatedRecord.error_status).toBe(expectedStatus)
      expect(updatedRecord).toMatchSnapshot(snapshotExclusions)
    })
  })
})
