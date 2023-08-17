import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "core/phase1/lib/encoding"
import { mapXmlCxe01ToAho } from "core/phase1/parse/parseAhoXml"
import type { AhoXml } from "core/phase1/types/AhoXml"
import type { PncQueryResult } from "core/phase1/types/PncQueryResult"
import { XMLParser } from "fast-xml-parser"

/*
Sample CXE element
<CXE01>
    <FSC FSCode="01ZD" IntfcUpdateType="K"/>
    <IDS CRONumber="" Checkname="Hudson" IntfcUpdateType="K" PNCID="2000/0410925R"/>
    <CourtCases>
        <CourtCase>
            <CCR CourtCaseRefNo="97/1626/008395Q" CrimeOffenceRefNo="" IntfcUpdateType="K"/>
            <Offences>
                <Offence>
                    <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="TH68010" IntfcUpdateType="K" OffEndDate="24092010" OffEndTime="0000" OffStartDate="20092010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Theft from a shop" ReferenceNumber="001"/>
                </Offence>
                <Offence>
                    <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="TH68010" IntfcUpdateType="K" OffEndDate="24092010" OffEndTime="0000" OffStartDate="20092010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Theft from a shop" ReferenceNumber="002"/>
                </Offence>
            </Offences>
        </CourtCase>
    </CourtCases>
</CXE01>
*/

export default (ahoXml: string): PncQueryResult | Error | undefined => {
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
  const rawParsedObj = parser.parse(ahoXml) as AhoXml

  const cxe = rawParsedObj["br7:AnnotatedHearingOutcome"]?.CXE01
  if (cxe) {
    return mapXmlCxe01ToAho(cxe)
  }

  const error = rawParsedObj["br7:AnnotatedHearingOutcome"]?.["br7:PNCErrorMessage"]?.["#text"]
  if (error) {
    return new Error(error)
  }
  return undefined
}
