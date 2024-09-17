import type { XML } from "@moj-bichard7/common/types/Xml"
import type { Br7AnnotatedHearingOutcome, Br7OrganisationUnit, Br7TextString } from "../../types/AhoXml"

export interface Br7Operation {
  operationCode:
    | {
        SENDEF:
          | {
              courtCaseReference: Br7TextString
            }
          | Br7TextString
      }
    | {
        SUBVAR:
          | {
              courtCaseReference: Br7TextString
            }
          | Br7TextString
      }
    | {
        PENHRG:
          | {
              courtCaseReference: Br7TextString
            }
          | Br7TextString
      }
    | {
        DISARR:
          | {
              courtCaseReference: Br7TextString
            }
          | Br7TextString
      }
    | {
        NEWREM:
          | {
              nextHearingDate: Br7TextString
              nextHearingLocation: Br7OrganisationUnit
            }
          | Br7TextString
      }
  operationStatus: Br7TextString
}

export interface PncUpdateDatasetParsedXml {
  "?xml"?: XML
  PNCUpdateDataset?: {
    "br7:AnnotatedHearingOutcome"?: Br7AnnotatedHearingOutcome
    Operation?: Br7Operation[]
  }
}
