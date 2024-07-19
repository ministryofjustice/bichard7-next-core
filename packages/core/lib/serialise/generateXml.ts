import { XMLBuilder, type XmlBuilderOptions } from "fast-xml-parser"
import { encodeAttributeEntitiesProcessor, encodeTagEntitiesProcessor } from "../encoding"

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
