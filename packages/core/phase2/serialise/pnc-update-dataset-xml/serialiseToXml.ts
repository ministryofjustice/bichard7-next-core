import { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { convertAhoToXml, mapAhoOrgUnitToXml, xmlnsTags } from "../../../phase1/serialise/ahoXml/serialiseToXml"
import { OperationStatusXml, PncOperationXml, PncUpdateDatasetXml } from "../../../phase1/types/PncUpdateDatasetXml"
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
        operationStatus: "F" //operation.status[0]
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
        operationStatus: "F" //operation.status[0]
      }
    }

    throw Error("Operation code not recognised")
  })
}

const serialiseToXml = (pncUpdateDataset: PncUpdateDataset): string => {
  const xmlAho = convertAhoToXml(pncUpdateDataset)
  const xmlPncUpdateDataset: PncUpdateDatasetXml = {
    "?xml": xmlAho["?xml"],
    PNCUpdateDataset: {
      ...{ ...xmlAho, "?xml": undefined },
      Operation: mapOperationToXml(pncUpdateDataset.PncOperations),
      ...xmlnsTags
    },
  }

  return generateXml(xmlPncUpdateDataset)
}

export default serialiseToXml
