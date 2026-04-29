import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000307RENQASIPNCA05A73000017300000120210901124873000001                                             050002293</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/6A      LEBOWSKI                </IDS>
        <CCR>K21/2732/6N                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K003    12:15:13:1   RT88191 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
      </ASI>
      <GMT>000016073ENQR000307R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU03", {
    expectedRequest: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/6A",
      courtCaseReference: "21/2732/000006N",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Subsequently Varied",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 101
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "546ee081-bd01-4aec-9ec0-063fadc94f2e"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 102
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "503db9f8-b5ae-4a1f-b48a-3a430c5ab369"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 103
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "5542a654-370e-4d88-8968-e706851605f8"
        }
      ]
    },
    count: 1
  })
]
