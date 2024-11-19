import { XMLParser } from "fast-xml-parser"

import type { AhoXml } from "../../types/AhoXml"
import type { PncQueryResult } from "../../types/PncQueryResult"

import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../lib/encoding"
import { mapXmlCxe01ToAho } from "../../lib/parse/parseAhoXml"

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

export default (ahoXml: string): Error | PncQueryResult | undefined => {
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
