const normaliseXml = (xml?: string): string =>
  xml
    ?.replace(/ Error="HO200200"/g, "")
    .replace(/ hasError="false"/g, "")
    .replace(' standalone="yes"', "") ?? ""

export default normaliseXml
