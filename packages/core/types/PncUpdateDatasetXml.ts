import type { XML } from "@moj-bichard7/common/types/Xml"

import type { AhoXml, Br7OrganisationUnit } from "./AhoXml"

type PenhrgOperationCode = {
  PENHRG:
    | {}
    | {
        courtCaseReference: string
      }
}

type SendefOperationCode = {
  SENDEF:
    | {}
    | {
        courtCaseReference: string
      }
}

type SubvarOperationCode = {
  SUBVAR:
    | {}
    | {
        courtCaseReference: string
      }
}

type DisarrOperationCode = {
  DISARR:
    | {}
    | {
        courtCaseReference: string
      }
}

type NewremOperationCode = {
  NEWREM:
    | {}
    | {
        nextHearingDate: string
        nextHearingLocation: Br7OrganisationUnit
      }
}

export type OperationStatusXml = "C" | "F" | "N"

export type PncOperationXml = {
  operationCode:
    | DisarrOperationCode
    | NewremOperationCode
    | PenhrgOperationCode
    | SendefOperationCode
    | SubvarOperationCode
  operationStatus: OperationStatusXml
}

export type PncUpdateDatasetXml = {
  "?xml"?: XML
  PNCUpdateDataset: {
    "@_xmlns"?: string
    "@_xmlns:ds"?: string
    "@_xmlns:xsi"?: string
    "br7:AnnotatedHearingOutcome"?: AhoXml
    Operation: PncOperationXml[]
  }
}
