import { isError } from "@moj-bichard7/common/types/Result"
import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../../lib/encoding"
import { extractExceptionsFromXml, mapXmlToAho } from "../../../lib/parse/parseAhoXml"
import { mapXmlOrganisationalUnitToAho } from "../../../lib/parse/parseAhoXml/parseAhoXml"
import type { Br7TextString } from "../../../types/AhoXml"
import type { Operation, OperationStatus, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { Br7Operation, PncUpdateDatasetParsedXml } from "../../types/PncUpdateDatasetParsedXml"
import { PNCMessageType } from "../../../types/operationCodes"

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

const removeEmptyOperations = (operationsXml: Br7Operation[]): Br7Operation[] => {
  return operationsXml.filter((element) => !!element.operationCode)
}

const mapXmlToOperation = (operationsXml: Br7Operation[]): Operation[] => {
  operationsXml = removeEmptyOperations(operationsXml)

  return operationsXml.map((operationXml) => {
    let operation: Operation | undefined = undefined

    if (PNCMessageType.REMAND in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.NEWREM)
        ? undefined
        : {
            nextHearingDate: operationXml.operationCode.NEWREM.nextHearingDate
              ? new Date(operationXml.operationCode.NEWREM.nextHearingDate["#text"])
              : undefined,
            nextHearingLocation: mapXmlOrganisationalUnitToAho(operationXml.operationCode.NEWREM.nextHearingLocation)
          }

      operation = {
        code: PNCMessageType.REMAND,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.SENTENCE_DEFERRED in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.SENDEF)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.SENDEF.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.SENTENCE_DEFERRED,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.DISPOSAL_UPDATED in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.SUBVAR)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.SUBVAR.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.DISPOSAL_UPDATED,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.NORMAL_DISPOSAL in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.DISARR)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.DISARR.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.NORMAL_DISPOSAL,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.PENALTY_HEARING in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.PENHRG)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.PENHRG.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.PENALTY_HEARING,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.COMMITTED_SENTENCING in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.COMSEN)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.COMSEN.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.COMMITTED_SENTENCING,
        status: mapXmlToOperationStatus(operationXml.operationStatus["#text"]),
        ...(data ? { data } : {})
      }
    }

    if (PNCMessageType.APPEALS_UPDATE in operationXml.operationCode) {
      const data = isEmptyElement(operationXml.operationCode.APPHRD)
        ? undefined
        : {
            courtCaseReference: operationXml.operationCode.APPHRD.courtCaseReference["#text"]
          }

      operation = {
        code: PNCMessageType.APPEALS_UPDATE,
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

export const mapXmlToPncUpdateDataSet = (pncUpdateDataSet: PncUpdateDatasetParsedXml): PncUpdateDataset | Error => {
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
    PncOperations: mapXmlToOperation(operationsArray),
    HasError: rootElement["br7:AnnotatedHearingOutcome"]["br7:HasError"]?.["#text"]?.toString() === "true"
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
  const pncUpdateDataset = mapXmlToPncUpdateDataSet(rawParsedObj)
  if (isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  pncUpdateDataset.Exceptions = extractExceptionsFromXml(xml).map((e) => {
    e.path.shift()
    return e
  })

  return pncUpdateDataset
}
