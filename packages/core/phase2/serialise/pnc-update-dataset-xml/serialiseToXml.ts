import type { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { convertPncUpdateDatasetToXml, mapAhoOrgUnitToXml } from "../../../phase1/serialise/ahoXml/serialiseToXml"
import type {
  OperationStatusXml,
  PncOperationXml,
  PncUpdateDatasetXml
} from "../../../phase1/types/PncUpdateDatasetXml"
import { toISODate } from "../../../phase1/lib/dates"
import generateXml from "../../../lib/xml/generateXml"
import type { AhoXml } from "../../../phase1/types/AhoXml"

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

const normaliseNamespaces = (xmlAho: AhoXml) => {
  delete xmlAho["br7:AnnotatedHearingOutcome"]?.["@_xmlns:ds"]
  delete xmlAho["br7:AnnotatedHearingOutcome"]?.["@_xmlns:xsi"]
  if (xmlAho["br7:AnnotatedHearingOutcome"]?.CXE01) {
    xmlAho["br7:AnnotatedHearingOutcome"].CXE01["@_xmlns"] = ""
  }
}

const serialiseToXml = (pncUpdateDataset: PncUpdateDataset, addHasErrorAttributes: boolean = false): string => {
  pncUpdateDataset.Exceptions.forEach((exception) => {
    exception.path.shift()
  })

  const xmlAho = convertPncUpdateDatasetToXml(pncUpdateDataset, addHasErrorAttributes)
  normaliseNamespaces(xmlAho)
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
