import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000305RENQASIPNCA05A73000017300000120210906105873000001                                             050002182</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      SENDEFOFFENC            </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
      </ASI>
      <GMT>000010073ENQR000305R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDEFOFFENCEADDED"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "9ad85926-d80a-42c7-9c6f-818e6b956e4e"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "35675860-bf39-460a-8e0f-ac4baa9fa0b6"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "8df844cb-f9e9-416a-ac88-ea957f061c83"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410856R",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      remandDate: "2010-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-10-26",
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
      <GMH>073ENQR000153RENQASIPNCA05A73000017300000120210906105873000001                                             050001962</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      SENDEFOFFENC            </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000153R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2010-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 9
              }
            }
          ],
          offenceId: "3307145a-229f-4609-8788-d05309342a50"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "7572fc89-3f3f-48c2-9927-01a7bb032364"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 11
              }
            }
          ],
          offenceId: "1ae4f8b2-139f-427d-af60-fda9fcde32b6"
        }
      ]
    },
    count: 1
  })
]
