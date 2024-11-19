import { XMLBuilder, type XmlBuilderOptions } from "fast-xml-parser"

import { encodeAttributeEntitiesProcessor, encodeTagEntitiesProcessor } from "../encoding"

const defaultOptions: Partial<XmlBuilderOptions> = {
  attributeValueProcessor: encodeAttributeEntitiesProcessor,
  ignoreAttributes: false,
  processEntities: false,
  suppressBooleanAttributes: false,
  suppressEmptyNode: true,
  tagValueProcessor: encodeTagEntitiesProcessor
}

const generateXml = (obj: unknown, options: XmlBuilderOptions = defaultOptions): string => {
  const builder = new XMLBuilder(options)
  return builder.build(obj)
}

export default generateXml
