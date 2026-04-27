import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000708RENQASIPNCA05A73000017300000120210903102373000001                                             050002907</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/14J     RESULT                  </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <COF>K002                 RR84043 17112010                </COF>
      </ASI>
      <GMT>000009073ENQR000708R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "RESULT",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/14J",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["FRANKLIN"],
        defendantLastName: "RESULT"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4013,
              disposalEffectiveDate: "2012-01-03"
            }
          ],
          offenceId: "17f060d8-bd65-4484-9b48-634d3bc3d056"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RR84043",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4013,
              disposalEffectiveDate: "2012-01-03"
            }
          ],
          offenceId: "24193e1f-9920-43cb-aab6-506d9136ff92"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "RESULT",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410908Y",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/14J",
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
        date: "2012-01-03",
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
      <GMH>073ENQR000709RENQASIPNCA05A73000017300000120210903102373000001                                             050002910</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/14J     RESULT                  </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000W</ADJ>
        <DIS>I4013    03012012                                                                                        </DIS>
        <COF>K002                 RR84043 17112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000W</ADJ>
        <DIS>I4013    03012012                                                                                        </DIS>
      </ASI>
      <GMT>000013073ENQR000709R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "RESULT",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/14J",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2012-01-03",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "773ba3d7-69cf-42aa-958c-e5f9a475fe9c"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RR84043",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0ba6f2da-3d2a-4968-92dc-0c5ce8a14bd9"
        }
      ]
    },
    count: 1
  })
]
