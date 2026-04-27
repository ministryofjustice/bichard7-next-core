import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000328RENQASIPNCA05A73000017300000120210901131573000001                                             050002335</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/19P     POTTIUS                 </IDS>
        <CCR>K21/2732/14X                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000328R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/19P",
      courtCaseReference: "21/2732/000014X",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JACOB"],
        defendantLastName: "POTTIUS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "f782208b-109c-4354-b3aa-7ca9e65b8150"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440769F",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/19P",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-28",
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
      <GMH>073ENQR000329RENQASIPNCA05A73000017300000120210901131573000001                                             050002338</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/19P     POTTIUS                 </IDS>
        <CCR>K21/2732/14X                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <ADJ>IGUILTY       GUILTY        261020110000 </ADJ>
        <DIS>I4027    28102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000329R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440769F",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/19P",
      remandDate: "2011-10-28",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-30",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
