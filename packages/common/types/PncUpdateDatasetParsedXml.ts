import type { Br7AnnotatedHearingOutcome, Br7OrganisationUnit, Br7TextString } from "./AhoXml"
import type { XML } from "./Xml"

export interface Br7Operation {
  operationCode:
    | {
        DISARR:
          | Br7TextString
          | {
              courtCaseReference: Br7TextString
            }
      }
    | {
        NEWREM:
          | Br7TextString
          | {
              nextHearingDate: Br7TextString
              nextHearingLocation: Br7OrganisationUnit
            }
      }
    | {
        PENHRG:
          | Br7TextString
          | {
              courtCaseReference: Br7TextString
            }
      }
    | {
        SENDEF:
          | Br7TextString
          | {
              courtCaseReference: Br7TextString
            }
      }
    | {
        SUBVAR:
          | Br7TextString
          | {
              courtCaseReference: Br7TextString
            }
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
