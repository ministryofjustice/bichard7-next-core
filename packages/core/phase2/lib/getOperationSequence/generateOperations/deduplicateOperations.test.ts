import { PncOperation } from "../../../../types/PncOperation"
import type { NewremOperation, Operation, OperationStatus } from "../../../../types/PncUpdateDataset"
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
    code: PncOperation.REMAND,
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
  code: Exclude<Operation["code"], PncOperation.REMAND>,
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
    { ops: [generateOperation(PncOperation.APPEALS_UPDATE), generateOperation(PncOperation.APPEALS_UPDATE)] },
    {
      ops: [generateOperation(PncOperation.COMMITTED_SENTENCING), generateOperation(PncOperation.COMMITTED_SENTENCING)]
    },
    { ops: [generateOperation(PncOperation.NORMAL_DISPOSAL), generateOperation(PncOperation.NORMAL_DISPOSAL)] },
    { ops: [generateOperation("PENHRG"), generateOperation("PENHRG")] },
    { ops: [generateOperation("SENDEF"), generateOperation("SENDEF")] },
    { ops: [generateOperation("SUBVAR"), generateOperation("SUBVAR")] }
  ])("should remove duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual([ops[0]])
  })

  it.each([
    { ops: [generateNewremOperation("Completed"), generateNewremOperation("NotAttempted")] },
    {
      ops: [
        generateOperation(PncOperation.APPEALS_UPDATE, "Completed"),
        generateOperation(PncOperation.APPEALS_UPDATE, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.COMMITTED_SENTENCING, "Completed"),
        generateOperation(PncOperation.COMMITTED_SENTENCING, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.NORMAL_DISPOSAL, "Completed"),
        generateOperation(PncOperation.NORMAL_DISPOSAL, "NotAttempted")
      ]
    },
    { ops: [generateOperation("PENHRG", "Completed"), generateOperation("PENHRG", "NotAttempted")] },
    { ops: [generateOperation("SENDEF", "Completed"), generateOperation("SENDEF", "NotAttempted")] },
    { ops: [generateOperation("SUBVAR", "Completed"), generateOperation("SUBVAR", "NotAttempted")] },

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
        generateOperation(PncOperation.APPEALS_UPDATE, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.APPEALS_UPDATE, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.COMMITTED_SENTENCING, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.COMMITTED_SENTENCING, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.NORMAL_DISPOSAL, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.NORMAL_DISPOSAL, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation("PENHRG", "Completed", { courtCaseReference: "1" }),
        generateOperation("PENHRG", "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation("SENDEF", "Completed", { courtCaseReference: "1" }),
        generateOperation("SENDEF", "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation("SUBVAR", "Completed", { courtCaseReference: "1" }),
        generateOperation("SUBVAR", "Completed", { courtCaseReference: "2" })
      ]
    }
  ])("should not remove non-duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual(ops)
  })
})
