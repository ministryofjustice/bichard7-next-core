import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
      <CXE01>
      <GMH>073ENQR000005RENQASIPNCA05A73000017300000120210920111073000001                                             050001759</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/1V      INNOCUOUS               </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000005R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "INNOCUOUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/1V",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MISTER"],
        defendantLastName: "INNOCUOUS"
      },
      referToCourtCase: {
        reference: "01ZD/5100008"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2060
            }
          ],
          offenceId: "d85fe2fc-31c4-4c2e-b120-7d434c4b37a4"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/410826J",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68072"
              },
              committedOnBail: false,
              plea: "Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 200
                  }
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    }
  })
]
