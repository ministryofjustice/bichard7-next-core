import { XML } from "@moj-bichard7/common/types/Xml"
import { AhoXml, Br7OrganisationUnit } from "./AhoXml"

type SendefOperationCode = {
  SENDEF:
    | {
        courtCaseReference: string
      }
    | {}
}

type DisarrOperationCode = {
  DISARR:
    | {
        courtCaseReference: string
      }
    | {}
}

type NewremOperationCode = {
  NEWREM:
    | {
        nextHearingDate: string
        nextHearingLocation: Br7OrganisationUnit
      }
    | {}
}

export type OperationStatusXml = "F" | "N" | "C"

export type PncOperationXml = {
  operationCode: SendefOperationCode | DisarrOperationCode | NewremOperationCode
  operationStatus: OperationStatusXml
}

export type PncUpdateDatasetXml = {
  "?xml"?: XML
  PNCUpdateDataset: {
    "br7:AnnotatedHearingOutcome"?: AhoXml
    Operation: PncOperationXml[]
    "@_xmlns:ds": string
    "@_xmlns:xsi": string
    "@_xmlns:br7": string
  }
}
