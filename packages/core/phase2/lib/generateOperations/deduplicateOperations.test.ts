import { PncOperation } from "../../../types/PncOperation"
import type { Operation, OperationStatus } from "../../../types/PncUpdateDataset"
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

const generateRemandOperation = (
  status: OperationStatus = "NotAttempted",
  params: Partial<Operation<PncOperation.REMAND>["data"]> = {},
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
  }) as Operation<PncOperation.REMAND>

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
    { ops: [generateRemandOperation(), generateRemandOperation()] },
    {
      ops: [
        generateRemandOperation("NotAttempted", {}, "1", true),
        generateRemandOperation("NotAttempted", {}, "2", true)
      ]
    },
    {
      ops: [
        generateRemandOperation("NotAttempted", {}, "1", false),
        generateRemandOperation("NotAttempted", {}, "1", true)
      ]
    },
    { ops: [generateOperation(PncOperation.NORMAL_DISPOSAL), generateOperation(PncOperation.NORMAL_DISPOSAL)] },
    { ops: [generateOperation(PncOperation.PENALTY_HEARING), generateOperation(PncOperation.PENALTY_HEARING)] },
    { ops: [generateOperation(PncOperation.SENTENCE_DEFERRED), generateOperation(PncOperation.SENTENCE_DEFERRED)] },
    { ops: [generateOperation(PncOperation.DISPOSAL_UPDATED), generateOperation(PncOperation.DISPOSAL_UPDATED)] }
  ])("should remove duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual([ops[0]])
  })

  it.each([
    { ops: [generateRemandOperation("Completed"), generateRemandOperation("NotAttempted")] },
    {
      ops: [
        generateOperation(PncOperation.NORMAL_DISPOSAL, "Completed"),
        generateOperation(PncOperation.NORMAL_DISPOSAL, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.PENALTY_HEARING, "Completed"),
        generateOperation(PncOperation.PENALTY_HEARING, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.SENTENCE_DEFERRED, "Completed"),
        generateOperation(PncOperation.SENTENCE_DEFERRED, "NotAttempted")
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.DISPOSAL_UPDATED, "Completed"),
        generateOperation(PncOperation.DISPOSAL_UPDATED, "NotAttempted")
      ]
    },

    {
      ops: [
        generateRemandOperation("Completed", { nextHearingDate: new Date("2024-07-10") }),
        generateRemandOperation("Completed", { nextHearingDate: new Date("2024-07-11") })
      ]
    },
    {
      ops: [
        generateRemandOperation("Completed", { nextHearingLocation: { ...organisationUnitCode1 } }),
        generateRemandOperation("Completed", { nextHearingLocation: { ...organisationUnitCode2 } })
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
        generateOperation(PncOperation.PENALTY_HEARING, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.PENALTY_HEARING, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.SENTENCE_DEFERRED, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.SENTENCE_DEFERRED, "Completed", { courtCaseReference: "2" })
      ]
    },
    {
      ops: [
        generateOperation(PncOperation.DISPOSAL_UPDATED, "Completed", { courtCaseReference: "1" }),
        generateOperation(PncOperation.DISPOSAL_UPDATED, "Completed", { courtCaseReference: "2" })
      ]
    }
  ])("should not remove non-duplicate operations", ({ ops }) => {
    const result = deduplicateOperations(ops)
    expect(result).toStrictEqual(ops)
  })
})
