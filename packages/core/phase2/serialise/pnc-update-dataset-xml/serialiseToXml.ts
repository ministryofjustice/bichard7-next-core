import { XMLBuilder } from "fast-xml-parser"
import { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { convertAhoToXml } from "../../../phase1/serialise/ahoXml/serialiseToXml"


const serialiseToXml = (
  pncUpdateDataset: PncUpdateDataset,
): string => {
  const xmlAho = convertAhoToXml(pncUpdateDataset)
  const builder = new XMLBuilder()

  return builder.build(xmlAho)
}

export default serialiseToXml
