import { ExceptionCode } from "@moj-bichard7/core/common/types/ExceptionCode"
import { TriggerCode } from "@moj-bichard7/core/common/types/TriggerCode"
import errorPaths from "@moj-bichard7/core/phase1/lib/errorPaths"
import generateMockPhase1Result from "@moj-bichard7/core/phase1/tests/helpers/generateMockPhase1Result"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"

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
