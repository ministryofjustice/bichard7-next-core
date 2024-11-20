import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import type { PncQueryResult } from "../../types/PncQueryResult"
import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import { PncApiError } from "../../lib/PncGateway"
import type { PncException } from "../../types/Exception"

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

export default (ahoXml: string): PncQueryResult | PncApiError => {
  const parsedAho = parseAhoXml(ahoXml)

  if (isError(parsedAho)) {
    throw parsedAho
  }

  if (parsedAho.PncQuery) {
    return parsedAho.PncQuery
  }

  const errorMessages = parsedAho.Exceptions.filter((e) => "message" in e).map((e) => (e as PncException).message)

  return new PncApiError(errorMessages)
}
