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
    code: "NEWREM",
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
  code: Exclude<Operation["code"], "NEWREM">,
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
    { ops: [generateOperation("APPHRD"), generateOperation("APPHRD")] },
    { ops: [generateOperation("COMSEN"), generateOperation("COMSEN")] },
    { ops: [generateOperation("DISARR"), generateOperation("DISARR")] },
    { ops: [generateOperation("PENHRG"), generateOperation("PENHRG")] },
    { ops: [generateOperation("SENDEF"), generateOperation("SENDEF")] },
    { ops: [generateOperation("SUBVAR"), generateOperation("SUBVAR")] }
  ])("should remove duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual([ops[0]])
  })

  it.each([
    { ops: [generateNewremOperation("Completed"), generateNewremOperation("NotAttempted")] },
    { ops: [generateOperation("APPHRD", "Completed"), generateOperation("APPHRD", "NotAttempted")] },
    { ops: [generateOperation("COMSEN", "Completed"), generateOperation("COMSEN", "NotAttempted")] },
    { ops: [generateOperation("DISARR", "Completed"), generateOperation("DISARR", "NotAttempted")] },
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
        generateOperation("APPHRD", "Completed", { courtCaseReference: "1" }),
        generateOperation("APPHRD", "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation("COMSEN", "Completed", { courtCaseReference: "1" }),
        generateOperation("COMSEN", "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation("DISARR", "Completed", { courtCaseReference: "1" }),
        generateOperation("DISARR", "Completed", { courtCaseReference: "2" })
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
