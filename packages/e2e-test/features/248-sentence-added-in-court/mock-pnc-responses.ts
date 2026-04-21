import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000335RENQASIPNCA05A73000017300000120210901140673000001                                             050002351</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     ADDOFFSENNOP            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000335R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/22T",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOEXCEPTION"],
        defendantLastName: "ADDOFFSENNOPNCADJ"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "c725586d-37f2-42f7-a06c-6f24d0b89134"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "5a52ec68-1f38-440d-b393-4a4a79d939ba"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445748R",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/22T",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000336RENQASIPNCA05A73000017300000120210901140673000001                                             050002354</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     ADDOFFSENNOP            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI><GMT>000013073ENQR000336R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/22T",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "84f553cc-e86c-4964-8f57-5682227d666a"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "75c71b1b-f8a3-4790-9d67-03994e0898c4"
        }
      ]
    },
    count: 1
  })
]
