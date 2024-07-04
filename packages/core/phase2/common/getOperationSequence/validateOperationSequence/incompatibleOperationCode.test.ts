import type { Operation } from "../../types/PncUpdateDataset"
import incompatibleOperationCode from "./incompatibleOperationCode"

describe("check incompatibleOperationCode", () => {
  it("SENDEF and NEWREM operations are incompatible if remandCcr set is empty", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const newrem: Operation = {
      code: "NEWREM",
      status: "Completed",
      data: {
        nextHearingLocation: {
          SecondLevelCode: null,
          BottomLevelCode: null,
          ThirdLevelCode: null,
          OrganisationUnitCode: "ABCDEFG"
        }
      }
    }

    const operations = [sendef, newrem]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["NEWREM", "SENDEF"])
  })

  it("SENDEF and NEWREM operations are allowed if remandCcr set is populated", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const newrem: Operation = {
      code: "NEWREM",
      status: "Completed",
      data: {
        nextHearingLocation: {
          SecondLevelCode: null,
          BottomLevelCode: null,
          ThirdLevelCode: null,
          OrganisationUnitCode: "ABCDEFG"
        }
      }
    }

    const operations = [sendef, newrem]
    const result = incompatibleOperationCode(operations, new Set("some_key"))

    expect(result).toBeUndefined()
  })

  it("PENHRG and NEWREM operations are compatible", () => {
    const sendef: Operation = {
      code: "PENHRG",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const newrem: Operation = {
      code: "NEWREM",
      status: "Completed",
      data: {
        nextHearingLocation: {
          SecondLevelCode: null,
          BottomLevelCode: null,
          ThirdLevelCode: null,
          OrganisationUnitCode: "ABCDEFG"
        }
      }
    }

    const operations = [sendef, newrem]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toBeUndefined()
  })

  it("SENDEF and PENHRG are incompatible", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }

    const operations = [sendef, penhrg]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["PENHRG", "SENDEF"])
  })

  it("PENHRG and any court case-specific operation are incompatible", () => {
    const subvar: Operation = {
      code: "SUBVAR",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed",
      data: {
        courtCaseReference: "BAR"
      }
    }

    const operations = [subvar, penhrg]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["PENHRG", "SUBVAR"])
  })

  it("NEWREM and APPHRD are incompatible", () => {
    const newrem: Operation = {
      code: "NEWREM",
      status: "Completed"
    }
    const aaphrd: Operation = {
      code: "APPHRD",
      status: "Completed"
    }

    const operations = [newrem, aaphrd]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["NEWREM", "APPHRD"])
  })

  it("NEWREM and COMSEN are incompatible", () => {
    const newrem: Operation = {
      code: "NEWREM",
      status: "Completed"
    }
    const consen: Operation = {
      code: "COMSEN",
      status: "Completed"
    }

    const operations = [newrem, consen]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["NEWREM", "COMSEN"])
  })

  it("PENHRG and APPHRD are incompatible", () => {
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed"
    }
    const apphrd: Operation = {
      code: "APPHRD",
      status: "Completed"
    }

    const operations = [penhrg, apphrd]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["PENHRG", "APPHRD"])
  })

  it("PENHRG and COMSEN are incompatible", () => {
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed"
    }
    const comsen: Operation = {
      code: "COMSEN",
      status: "Completed"
    }

    const operations = [penhrg, comsen]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["PENHRG", "COMSEN"])
  })

  it("remandCcrs containing SENDEF court case reference is incompatible", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const remandCcrs = new Set(["FOO"])

    const operations = [sendef]
    const result = incompatibleOperationCode(operations, remandCcrs)

    expect(result).toEqual(["NEWREM", "SENDEF"])
  })

  it("SUBVAR and SENDEF with the same court case reference is incompatible", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const subvar: Operation = {
      code: "SUBVAR",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }

    const operations = [sendef, subvar]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["SENDEF", "SUBVAR"])
  })

  it("SUBVAR and SENDEF with undefined court case reference is incompatible", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed"
    }
    const subvar: Operation = {
      code: "SUBVAR",
      status: "Completed"
    }

    const operations = [sendef, subvar]
    const result = incompatibleOperationCode(operations, new Set())

    expect(result).toEqual(["SENDEF", "SUBVAR"])
  })
})
