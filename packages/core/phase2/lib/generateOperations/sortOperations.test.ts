import type { Operation } from "../../../types/PncUpdateDataset"

import { PncOperation } from "../../../types/PncOperation"
import sortOperations from "./sortOperations"

describe("check sortOperations", () => {
  const sendef: Operation = {
    code: PncOperation.SENTENCE_DEFERRED,
    data: {
      courtCaseReference: "FOO1"
    },
    status: "Completed"
  }
  const sendef2: Operation = {
    code: PncOperation.SENTENCE_DEFERRED,
    data: {
      courtCaseReference: "FOO2"
    },
    status: "Completed"
  }
  const disarr: Operation = {
    code: PncOperation.NORMAL_DISPOSAL,
    data: {
      courtCaseReference: "FOO"
    },
    status: "Completed"
  }
  const newrem1: Operation = {
    code: PncOperation.REMAND,
    data: {
      nextHearingLocation: {
        BottomLevelCode: null,
        OrganisationUnitCode: "ABCDEFG",
        SecondLevelCode: null,
        ThirdLevelCode: null
      }
    },
    status: "Completed"
  }
  const newrem2: Operation = {
    code: PncOperation.REMAND,
    data: {
      nextHearingLocation: {
        BottomLevelCode: null,
        OrganisationUnitCode: "HIJKLMN",
        SecondLevelCode: null,
        ThirdLevelCode: null
      }
    },
    status: "Completed"
  }
  it("After sorting NEWREM is after other operations", () => {
    const operations = [newrem1, sendef, disarr]
    const result = sortOperations(operations)

    expect(result).toHaveLength(3)
    expect(result).toStrictEqual([sendef, disarr, newrem1])
  })

  it("After sorting ordering of non-NEWREMs is unchanged", () => {
    const operations = [sendef, disarr, sendef2, sendef, newrem1]
    const result = sortOperations(operations)

    expect(result).toStrictEqual([sendef, disarr, sendef2, sendef, newrem1])
  })

  it("After sorting ordering of multiple NEWREMs is preserved", () => {
    const operations = [sendef, newrem1, sendef2, newrem2]
    const result = sortOperations(operations)

    expect(result).toStrictEqual([sendef, sendef2, newrem1, newrem2])
  })
})
