import { COMMON_LAWS, INDICTMENT } from "src/lib/properties"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import { isCommonLaw, isIndictment } from "./isOffenceType"

const createReasonProp = (offenceCode: string): { Reason: string } => ({
  Reason: offenceCode.length > 4 ? offenceCode.substring(4, Math.min(7, offenceCode.length)) : ""
})

const createQualifierProp = (offenceCode: string): { Qualifier: string } | undefined =>
  offenceCode.length > 7 ? { Qualifier: offenceCode[7] } : undefined

export const getNationalOffenceReason = (offenceCode: string): OffenceReason | undefined => {
  if (isCommonLaw(offenceCode)) {
    return {
      __type: "NationalOffenceReason",
      OffenceCode: {
        __type: "CommonLawOffenceCode",
        CommonLawOffence: COMMON_LAWS,
        ...createReasonProp(offenceCode),
        ...createQualifierProp(offenceCode),
        FullCode: offenceCode
      }
    }
  }
  if (isIndictment(offenceCode)) {
    return {
      __type: "NationalOffenceReason",
      OffenceCode: {
        __type: "IndictmentOffenceCode",
        Indictment: INDICTMENT,
        ...createReasonProp(offenceCode),
        ...createQualifierProp(offenceCode),
        FullCode: offenceCode
      }
    }
  }

  return {
    __type: "NationalOffenceReason",
    OffenceCode: {
      __type: "NonMatchingOffenceCode",
      ActOrSource: offenceCode.length < 2 ? offenceCode : offenceCode.substring(0, 2),
      ...{ Year: offenceCode.length > 2 ? offenceCode.substring(2, Math.min(4, offenceCode.length)) : "" },
      ...createReasonProp(offenceCode),
      ...createQualifierProp(offenceCode),
      FullCode: offenceCode
    }
  }
}

export const getLocalOffenceReason = (offenceCode: string, areaCode: string): OffenceReason => ({
  __type: "LocalOffenceReason",
  LocalOffenceCode: {
    AreaCode: areaCode,
    OffenceCode: offenceCode
  }
})
