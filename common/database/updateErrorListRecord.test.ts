import errorPaths from "core/phase1/src/lib/errorPaths"
import type ErrorListRecord from "core/phase1/src/types/ErrorListRecord"
import { ExceptionCode } from "core/phase1/src/types/ExceptionCode"
import generateMockPhase1Result from "core/phase1/tests/helpers/generateMockPhase1Result"
import postgres from "postgres"
import createDbConfig from "./createDbConfig"
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

  it("should update the error list record correctly", async () => {
    const result = generateMockPhase1Result()
    const recordId = await insertErrorListRecord(db, result)

    result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "new_asn"
    result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN = "new_ptiurn"
    result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner!.SecondLevelCode = "99"
    result.hearingOutcome.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })

    await updateErrorListRecord(db, recordId, result)

    const updatedRecord = (
      await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list WHERE error_id = ${recordId}`
    )[0]

    expect(updatedRecord).toMatchSnapshot(snapshotExclusions)
  })
})
