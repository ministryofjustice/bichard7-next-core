import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../../phase1/lib/encoding"
import { mapXmlToAho } from "../../../phase1/parse/parseAhoXml"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { Br7Operation, PncUpdateDatasetXml } from "../../types/PncUpdateDatasetXml"
import { mapXmlOrganisationalUnitToAho } from "../../../phase1/parse/parseAhoXml/parseAhoXml"
import type { Br7TextString } from "../../../phase1/types/AhoXml"

const mapXmlToOperationStatus = (statusXml: string): OperationStatus => {
  const statuses: Record<string, OperationStatus> = {
    F: "Failed",
    C: "Completed",
    N: "NotAttempted"
  }

  return statuses[statusXml] || statusXml
}

const isEmptyElement = <T>(result: T | Br7TextString): result is Br7TextString => {
  return (result as Br7TextString)["#text"] === ""
}

const removeEmptyOperations =(operationsXml: Br7Operation[]): Br7Operation[] => {
  return operationsXml.filter(element => !!element.operationCode)
}

const mapXmlToOperation = (operationsXml: Br7Operation[]): Operation[] => {
  operationsXml = removeEmptyOperations(operationsXml)
  
  return operationsXml.map((operationXml) => {
    let operation: Operation | undefined = undefined

    if ("NEWREM" in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.NEWREM)
        ? undefined
        : {
            nextHearingDate: new Date(operationXml.operationCode.NEWREM.nextHearingDate["#text"]),
            nextHearingLocation: mapXmlOrganisationalUnitToAho(operationXml.operationCode.NEWREM.nextHearingLocation)
          }

      operation = {
        code: "NEWREM",
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if ("SENDEF" in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.SENDEF)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.SENDEF.courtCaseReference["#text"]
          }

      operation = {
        code: "SENDEF",
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if ("DISARR" in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.DISARR)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.DISARR.courtCaseReference["#text"]
          }

      operation = {
        code: "DISARR",
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

const mapXmlToPNCUpdateDataSet = (pncUpdateDataSet: PncUpdateDatasetXml): PncUpdateDataset | Error => {
  const rootElement = pncUpdateDataSet["PNCUpdateDataset"]
  if (!rootElement || !rootElement["br7:AnnotatedHearingOutcome"]) {
    return Error("Could not parse PNC update dataset XML")
  }

  const aho = mapXmlToAho(rootElement)
  if (isError(aho)) {
    return aho
  }

  const operationsArray = getOperationsAsArray(rootElement["Operation"])
  
  const pncUpdateDataset = {
    ...aho,
    PncOperations: mapXmlToOperation(operationsArray)
  }

  return pncUpdateDataset
}

export default (xml: string): PncUpdateDataset | Error => {
  const options = {
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    processEntities: false,
    trimValues: false,
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    tagValueProcessor: decodeTagEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)

  return mapXmlToPNCUpdateDataSet(rawParsedObj)
}
