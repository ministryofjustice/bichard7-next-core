import type { NewremOperation, Operation, OperationStatus } from "../../../../types/PncUpdateDataset"
import { PNCMessageType } from "../../../types/operationCodes"
import deduplicateOperations from "./deduplicateOperations"

const organisationUnitCode1 = {
  OrganisationUnitCode: "B20BN00",
  TopLevelCode: "B",
  SecondLevelCode: "20",
  ThirdLevelCode: "BN",
  BottomLevelCode: "00"
}

const organisationUnitCode2 = {
  ...organisationUnitCode1,
  OrganisationUnitCode: "A20BN00",
  TopLevelCode: "A"
}

const generateNewremOperation = (
  status: OperationStatus = "NotAttempted",
  params: Partial<NewremOperation["data"]> = {},
  courtCaseReference?: string,
  isAdjournmentPreJudgement?: boolean
) =>
  ({
    code: PNCMessageType.REMAND,
    status,
    courtCaseReference,
    isAdjournmentPreJudgement,
    data: {
      ...{
        nextHearingDate: new Date("2024-06-12"),
        nextHearingLocation: { ...organisationUnitCode1 }
      },
      ...params
    }
  }) as NewremOperation

const generateOperation = (
  code: Exclude<Operation["code"], PNCMessageType.REMAND>,
  status: OperationStatus = "NotAttempted",
  params: {
    courtCaseReference?: string
  } = {}
) =>
  ({
    code,
    status,
    data: {
      ...{
        courtCaseReference: "1"
      },
      ...params
    }
  }) as Operation

describe("deduplicateOperations", () => {
  it.each([
    { ops: [generateNewremOperation(), generateNewremOperation()] },
    {
      ops: [
        generateNewremOperation("NotAttempted", {}, "1", true),
        generateNewremOperation("NotAttempted", {}, "2", true)
      ]
    },
    {
      ops: [
        generateNewremOperation("NotAttempted", {}, "1", false),
        generateNewremOperation("NotAttempted", {}, "1", true)
      ]
    },
    { ops: [generateOperation(PNCMessageType.APPEALS_UPDATE), generateOperation(PNCMessageType.APPEALS_UPDATE)] },
    {
      ops: [
        generateOperation(PNCMessageType.COMMITTED_SENTENCING),
        generateOperation(PNCMessageType.COMMITTED_SENTENCING)
      ]
    },
    { ops: [generateOperation(PNCMessageType.NORMAL_DISPOSAL), generateOperation(PNCMessageType.NORMAL_DISPOSAL)] },
    { ops: [generateOperation(PNCMessageType.PENALTY_HEARING), generateOperation(PNCMessageType.PENALTY_HEARING)] },
    { ops: [generateOperation(PNCMessageType.SENTENCE_DEFERRED), generateOperation(PNCMessageType.SENTENCE_DEFERRED)] },
    { ops: [generateOperation(PNCMessageType.DISPOSAL_UPDATED), generateOperation(PNCMessageType.DISPOSAL_UPDATED)] }
  ])("should remove duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual([ops[0]])
  })

  it.each([
    { ops: [generateNewremOperation("Completed"), generateNewremOperation("NotAttempted")] },
    {
      ops: [
        generateOperation(PNCMessageType.APPEALS_UPDATE, "Completed"),
        generateOperation(PNCMessageType.APPEALS_UPDATE, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.COMMITTED_SENTENCING, "Completed"),
        generateOperation(PNCMessageType.COMMITTED_SENTENCING, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.NORMAL_DISPOSAL, "Completed"),
        generateOperation(PNCMessageType.NORMAL_DISPOSAL, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.PENALTY_HEARING, "Completed"),
        generateOperation(PNCMessageType.PENALTY_HEARING, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.SENTENCE_DEFERRED, "Completed"),
        generateOperation(PNCMessageType.SENTENCE_DEFERRED, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.DISPOSAL_UPDATED, "Completed"),
        generateOperation(PNCMessageType.DISPOSAL_UPDATED, "NotAttempted")
      ]
    },

    {
      ops: [
        generateNewremOperation("Completed", { nextHearingDate: new Date("2024-07-10") }),
        generateNewremOperation("Completed", { nextHearingDate: new Date("2024-07-11") })
      ]
    },
    {
      ops: [
        generateNewremOperation("Completed", { nextHearingLocation: { ...organisationUnitCode1 } }),
        generateNewremOperation("Completed", { nextHearingLocation: { ...organisationUnitCode2 } })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.APPEALS_UPDATE, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.APPEALS_UPDATE, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.COMMITTED_SENTENCING, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.COMMITTED_SENTENCING, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.NORMAL_DISPOSAL, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.NORMAL_DISPOSAL, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.PENALTY_HEARING, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.PENALTY_HEARING, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.SENTENCE_DEFERRED, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.SENTENCE_DEFERRED, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PNCMessageType.DISPOSAL_UPDATED, "Completed", { courtCaseReference: "1" }),
        generateOperation(PNCMessageType.DISPOSAL_UPDATED, "Completed", { courtCaseReference: "2" })
      ]
    }
  ])("should not remove non-duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual(ops)
  })
})
