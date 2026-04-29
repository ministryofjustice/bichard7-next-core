import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000138RENQASIPNCA05A73000017300000120210831091673000001                                             050001963</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/18B     WELLINGTON              </IDS>
        <CCR>K12/2732/26D                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K12/2732/27E                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000138R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "WELLINGTON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/18B",
      courtCaseReference: "12/2732/000026D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "WELLINGTON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0c26bf0a-4eb8-496c-b768-035360fa97c5"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 13
              }
            }
          ],
          offenceId: "e406670b-1bcc-4078-b72b-8caed4e76db6"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000139RENQASIPNCA05A73000017300000120210831091673000001                                             050001965</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/18B     WELLINGTON              </IDS>
        <CCR>K12/2732/26D                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M13                                                                                                 </DIS>
        <CCR>K12/2732/27E                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000139R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "WELLINGTON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/10X",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/18B",
      remandDate: "2009-10-20",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
