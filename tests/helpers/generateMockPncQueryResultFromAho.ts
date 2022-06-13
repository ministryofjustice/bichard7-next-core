import { XMLParser } from "fast-xml-parser"
import mapXmlCxe01ToAho from "src/lib/mapXmlCxe01ToAho"
import type { PncQueryResult } from "src/types/PncQueryResult"
import type { Cxe01, RawAho } from "src/types/RawAho"

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

export default (ahoXml: string): PncQueryResult | undefined => {
  const options = {
    ignoreAttributes: false
  }
  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(ahoXml) as RawAho

  const cxe = rawParsedObj["br7:AnnotatedHearingOutcome"]?.CXE01 as Cxe01
  if (!cxe) {
    return undefined
  }

  return mapXmlCxe01ToAho(cxe)
}
