import {
  encodeAttributeEntitiesProcessor,
  encodeTagEntitiesProcessor
} from "@moj-bichard7/common/aho/parseAhoXml/encoding"
import { XMLBuilder, type XmlBuilderOptions } from "fast-xml-parser"

const defaultOptions: Partial<XmlBuilderOptions> = {
  ignoreAttributes: false,
  suppressEmptyNode: true,
  processEntities: false,
  suppressBooleanAttributes: false,
  tagValueProcessor: encodeTagEntitiesProcessor,
  attributeValueProcessor: encodeAttributeEntitiesProcessor
}

const generateXml = (obj: unknown, options: XmlBuilderOptions = defaultOptions): string => {
  const builder = new XMLBuilder(options)
  return builder.build(obj)
}

export default generateXml
