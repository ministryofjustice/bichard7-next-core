import type { Operation } from "../../../types/PncUpdateDataset"
import { PNCMessageType } from "../../../types/operationCodes"
import validateOperations from "./validateOperations"

const allOperations = [
  PNCMessageType.REMAND,
  PNCMessageType.NORMAL_DISPOSAL,
  PNCMessageType.SENTENCE_DEFERRED,
  PNCMessageType.DISPOSAL_UPDATED,
  PNCMessageType.PENALTY_HEARING,
  PNCMessageType.COMMITTED_SENTENCING,
  PNCMessageType.APPEALS_UPDATE
]
const ccrs = [1, 2, null]

const allCombinations = allOperations
  .map((op1) => allOperations.map((op2) => ccrs.map((ccr) => [op1, op2, ccr])))
  .flat(2)

describe("validateOperations", () => {
  it.each(allCombinations)("should match existing behaviour %s:%s (CCR: %s)", (opCode1, opCode2, ccr) => {
    const op1 = { code: opCode1 } as unknown as Operation
    const op2 = { code: opCode2 } as unknown as Operation
    if (op1.code !== PNCMessageType.REMAND) {
      op1.data = {
        courtCaseReference: "1"
      }
    }

    if (op2.code !== PNCMessageType.REMAND) {
      op2.data = {
        courtCaseReference: "1"
      }
    }

    const remandCcrs = new Set<string>()
    if (ccr) {
      remandCcrs.add(String(ccr))
    }

    const result = validateOperations([op1, op2], remandCcrs)
    expect(result).toMatchSnapshot()
  })
})
