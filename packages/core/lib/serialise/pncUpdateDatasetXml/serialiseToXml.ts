import type { AhoXml } from "@moj-bichard7/common/types/AhoXml"
import type { Operation, OperationStatus, PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type { OperationStatusXml, PncOperationXml, PncUpdateDatasetXml } from "../../../types/PncUpdateDatasetXml"

import { toISODate } from "../../dates"
import { convertPncUpdateDatasetToXml, mapAhoOrgUnitToXml } from "../ahoXml/serialiseToXml"
import generateXml from "../generateXml"

export const mapOperationStatus = (status: OperationStatus): OperationStatusXml => {
  const statuses: Record<OperationStatus, OperationStatusXml> = {
    Failed: "F",
    NotAttempted: "N",
    Completed: "C"
  }

  return statuses[status]
}

const mapOperationToXml = (pncOperations: Operation[]): PncOperationXml[] => {
  return pncOperations.map<PncOperationXml>((operation) => {
    if (operation.code === PncOperation.NORMAL_DISPOSAL) {
      return {
        operationCode: {
          [PncOperation.NORMAL_DISPOSAL]: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === PncOperation.SENTENCE_DEFERRED) {
      return {
        operationCode: {
          [PncOperation.SENTENCE_DEFERRED]: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === PncOperation.DISPOSAL_UPDATED) {
      return {
        operationCode: {
          [PncOperation.DISPOSAL_UPDATED]: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === PncOperation.PENALTY_HEARING) {
      return {
        operationCode: {
          [PncOperation.PENALTY_HEARING]: operation.data
            ? {
                courtCaseReference: operation.data.courtCaseReference
              }
            : {}
        },
        operationStatus: mapOperationStatus(operation.status)
      }
    }

    if (operation.code === PncOperation.REMAND) {
      return {
        operationCode: {
          [PncOperation.REMAND]: operation.data
            ? {
                nextHearingDate: operation.data.nextHearingDate ? toISODate(operation.data.nextHearingDate) : undefined,
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

export const mapToPncUpdateDatasetXml = (
  pncUpdateDataset: PncUpdateDataset,
  addFalseHasErrorAttributes = false,
  includeExceptions = true
): PncUpdateDatasetXml => {
  const xmlAho = convertPncUpdateDatasetToXml(pncUpdateDataset, addFalseHasErrorAttributes, includeExceptions)
  normaliseNamespaces(xmlAho)
  return {
    "?xml": xmlAho["?xml"],
    PNCUpdateDataset: {
      ...{ ...xmlAho, "?xml": undefined },
      Operation: mapOperationToXml(pncUpdateDataset.PncOperations),
      ...xmlnsTags
    }
  }
}

const serialiseToXml = (
  pncUpdateDataset: PncUpdateDataset,
  addFalseHasErrorAttributes = false,
  includeExceptions = true
): string => {
  const xmlPncUpdateDataset = mapToPncUpdateDatasetXml(pncUpdateDataset, addFalseHasErrorAttributes, includeExceptions)

  return generateXml(xmlPncUpdateDataset)
}

export default serialiseToXml
