import { XMLParser } from "fast-xml-parser"

import type { Br7TextString } from "../../../types/AhoXml"
import type { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { Br7Operation, PncUpdateDatasetParsedXml } from "../../../types/PncUpdateDatasetParsedXml"

import { PncOperation } from "../../../types/PncOperation"
import { isError } from "../../../types/Result"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../parseAhoXml/encoding"
import { extractExceptionsFromXml, mapXmlToAho } from "../../parseAhoXml/index"
import { mapXmlOrganisationalUnitToAho } from "../../parseAhoXml/parseAhoXml"

const mapXmlToOperationStatus = (statusXml: string): OperationStatus => {
  const statuses: Record<string, OperationStatus> = {
    C: "Completed",
    F: "Failed",
    N: "NotAttempted"
  }

  return statuses[statusXml] || statusXml
}

const isEmptyElement = <T>(result: Br7TextString | T): result is Br7TextString => {
  return (result as Br7TextString)["#text"] === ""
}

const removeEmptyOperations = (operationsXml: Br7Operation[]): Br7Operation[] => {
  return operationsXml.filter((element) => !!element.operationCode)
}

const mapXmlToOperation = (operationsXml: Br7Operation[]): Operation[] => {
  operationsXml = removeEmptyOperations(operationsXml)

  return operationsXml.map((operationXml) => {
    let operation: Operation | undefined = undefined

    if (PncOperation.REMAND in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.NEWREM)
        ? undefined
        : {
            nextHearingDate: operationXml.operationCode.NEWREM.nextHearingDate
              ? new Date(operationXml.operationCode.NEWREM.nextHearingDate["#text"])
              : undefined,
            nextHearingLocation: mapXmlOrganisationalUnitToAho(operationXml.operationCode.NEWREM.nextHearingLocation)
          }

      operation = {
        code: PncOperation.REMAND,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PncOperation.SENTENCE_DEFERRED in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.SENDEF)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.SENDEF.courtCaseReference["#text"]
          }

      operation = {
        code: PncOperation.SENTENCE_DEFERRED,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PncOperation.DISPOSAL_UPDATED in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.SUBVAR)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.SUBVAR.courtCaseReference["#text"]
          }

      operation = {
        code: PncOperation.DISPOSAL_UPDATED,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PncOperation.NORMAL_DISPOSAL in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.DISARR)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.DISARR.courtCaseReference["#text"]
          }

      operation = {
        code: PncOperation.NORMAL_DISPOSAL,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PncOperation.PENALTY_HEARING in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.PENHRG)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.PENHRG.courtCaseReference["#text"]
          }

      operation = {
        code: PncOperation.PENALTY_HEARING,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (!operation) {
      throw Error("Operation is not supported")
    }

    return operation
  })
}

const getOperationsAsArray = (operations?: Br7Operation | Br7Operation[]): Br7Operation[] => {
  if (operations === undefined) {
    return []
  }

  if (Array.isArray(operations)) {
    return operations
  }

  return [operations]
}

export const mapXmlToPncUpdateDataSet = (pncUpdateDataSet: PncUpdateDatasetParsedXml): Error | PncUpdateDataset => {
  const rootElement = pncUpdateDataSet["PNCUpdateDataset"]
  if (!rootElement?.["br7:AnnotatedHearingOutcome"]) {
    return Error("Could not parse PNC update dataset XML")
  }

  const aho = mapXmlToAho(rootElement)
  if (isError(aho)) {
    return aho
  }

  const operationsArray = getOperationsAsArray(rootElement["Operation"])

  const pncUpdateDataset = {
    ...aho,
    HasError: rootElement["br7:AnnotatedHearingOutcome"]["br7:HasError"]?.["#text"]?.toString() === "true",
    PncOperations: mapXmlToOperation(operationsArray)
  }

  return pncUpdateDataset
}

export default (xml: string): Error | PncUpdateDataset => {
  const options = {
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    processEntities: false,
    tagValueProcessor: decodeTagEntitiesProcessor,
    trimValues: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const pncUpdateDataset = mapXmlToPncUpdateDataSet(rawParsedObj)
  if (isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  // Remove the PNCUpdateDateset element from the exception path for consistency
  pncUpdateDataset.Exceptions = extractExceptionsFromXml(xml).map((e) => ({
    ...e,
    path: e.path.slice(1)
  }))

  return pncUpdateDataset
}
