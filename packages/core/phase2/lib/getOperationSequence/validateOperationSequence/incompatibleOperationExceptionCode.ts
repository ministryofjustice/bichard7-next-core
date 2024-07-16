import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

const incompatibleOperationExceptionCode = (incompatibleOperationCodes: string[]): ExceptionCode | undefined => {
  if (incompatibleOperationCodes[0] === incompatibleOperationCodes[1]) {
    return ExceptionCode.HO200109
  }

  if (incompatibleOperationCodes.includes("APPHRD")) {
    return ExceptionCode.HO200109
  }

  if (incompatibleOperationCodes.includes("DISARR")) {
    if (incompatibleOperationCodes.includes("COMSEN")) {
      return ExceptionCode.HO200112
    }

    if (incompatibleOperationCodes.includes("SUBVAR") || incompatibleOperationCodes.includes("PENHRG")) {
      return ExceptionCode.HO200115
    }
  }

  if (incompatibleOperationCodes.includes("NEWREM")) {
    if (incompatibleOperationCodes.includes("SENDEF") || incompatibleOperationCodes.includes("COMSEN")) {
      return ExceptionCode.HO200113
    }
  }

  if (incompatibleOperationCodes.includes("SENDEF")) {
    if (incompatibleOperationCodes.includes("APPHRD") || incompatibleOperationCodes.includes("COMSEN")) {
      return ExceptionCode.HO200109
    } else if (incompatibleOperationCodes.includes("SUBVAR") || incompatibleOperationCodes.includes("PENHRG")) {
      return ExceptionCode.HO200114
    } else if (incompatibleOperationCodes.includes("DISARR")) {
      return ExceptionCode.HO200112
    }
  }

  if (incompatibleOperationCodes.includes("SUBVAR") && incompatibleOperationCodes.includes("PENHRG")) {
    return ExceptionCode.HO200109
  }
}

export default incompatibleOperationExceptionCode
