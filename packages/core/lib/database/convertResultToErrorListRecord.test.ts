import convertResultToErrorListRecord from "lib/database/convertResultToErrorListRecord"
import errorPaths from "phase1/lib/errorPaths"
import generateMockPhase1Result from "phase1/tests/helpers/generateMockPhase1Result"
import { ExceptionCode } from "types/ExceptionCode"
import { TriggerCode } from "types/TriggerCode"

describe("convertResultToErrorListRecord", () => {
  it("should generate the error list record", () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001 }],
      hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
    })
    const convertedResult = convertResultToErrorListRecord(phase1Result)
    expect(convertedResult).toMatchSnapshot({
      trigger_insert_ts: expect.any(Date),
      msg_received_ts: expect.any(Date),
      error_insert_ts: expect.any(Date),
      create_ts: expect.any(Date),
      annotated_msg: expect.any(String),
      updated_msg: expect.any(String),
      message_id: expect.any(String)
    })
  })
})
