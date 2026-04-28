import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000718RENQASIPNCA05A73000017300000120210903102573000001                                             050002928</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/21R     ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
      </ASI>
      <GMT>000008073ENQR000718R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PNCADJ"],
        defendantLastName: "ADDEDOFFENCEJWFTWO"
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
              disposalEffectiveDate: "2012-01-01"
            }
          ],
          offenceId: "65c4d31f-f7cf-4fcd-93c4-38a868eb5281"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445117G",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
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
        date: "2012-01-01",
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
      <GMH>073ENQR000719RENQASIPNCA05A73000017300000120210903102573000001                                             050002931</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/21R     ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I4004    01012012                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000719R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445117G",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
      remandDate: "2012-01-01",
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
  })
]
