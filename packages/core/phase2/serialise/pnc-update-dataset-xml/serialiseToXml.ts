import type { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { convertAhoToXml, mapAhoOrgUnitToXml } from "../../../phase1/serialise/ahoXml/serialiseToXml"
import type {
  OperationStatusXml,
  PncOperationXml,
  PncUpdateDatasetXml
} from "../../../phase1/types/PncUpdateDatasetXml"
import { toISODate } from "../../../phase1/lib/dates"
import generateXml from "../../../lib/xml/generateXml"

const mapOperationStatus = (status: OperationStatus): OperationStatusXml => {
  const statuses: Record<OperationStatus, OperationStatusXml> = {
    Failed: "F",
    NotAttempted: "N",
    Completed: "C"
  }

  return statuses[status]
}

const mapOperationToXml = (pncOperations: Operation[]): PncOperationXml[] => {
  return pncOperations.map<PncOperationXml>((operation) => {
    if (operation.code === "DISARR") {
      return {
        operationCode: {
          DISARR: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === "SENDEF") {
      return {
        operationCode: {
          SENDEF: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === "NEWREM") {
      return {
        operationCode: {
          NEWREM: operation.data
            ? {
                nextHearingDate: toISODate(operation.data.nextHearingDate),
                nextHearingLocation: mapAhoOrgUnitToXml(operation.data.nextHearingLocation)
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    throw Error("Operation code not recognised")
  })
}

const xmlnsTags = {
  "@_xmlns": "http://www.example.org/NewXMLSchema",
  "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
  "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
}

const serialiseToXml = (pncUpdateDataset: PncUpdateDataset): string => {
  const xmlAho = convertAhoToXml(pncUpdateDataset)
  delete xmlAho["br7:AnnotatedHearingOutcome"]?.["@_xmlns:ds"]
  delete xmlAho["br7:AnnotatedHearingOutcome"]?.["@_xmlns:xsi"]

  const xmlPncUpdateDataset: PncUpdateDatasetXml = {
    "?xml": xmlAho["?xml"],
    PNCUpdateDataset: {
      ...{ ...xmlAho, "?xml": undefined },
      Operation: mapOperationToXml(pncUpdateDataset.PncOperations),
      ...xmlnsTags
    }
  }

  return generateXml(xmlPncUpdateDataset)
}

export default serialiseToXml
