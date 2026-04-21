import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000324RENQASIPNCA05A73000017300000120210901130673000001                                             050002326</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/15K     HARLOW                  </IDS>
        <CCR>K21/2732/12V                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
      </ASI>
      <GMT>000008073ENQR000324R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HARLOW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/15K",
      courtCaseReference: "21/2732/000012V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ALAN"],
        defendantLastName: "HARLOW"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2012-02-01"
            }
          ],
          offenceId: "189fbaa6-7ad9-40a1-8958-a94482e3e08d"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HARLOW",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410871H",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/15K",
      remandDate: "2011-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-02-01",
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
      <GMH>073ENQR000325RENQASIPNCA05A73000017300000120210901130673000001                                             050002329</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/15K     HARLOW                  </IDS>
        <CCR>K21/2732/12V                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I4004    01022012                                                                                        </DIS>
      </ASI><GMT>000010073ENQR000325R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "HARLOW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/15K",
      courtCaseReference: "21/2732/000012V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-12-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "ebe791af-0e1d-4f45-ba30-843f788cdf28"
        }
      ]
    },
    count: 1
  })
]
