import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000137RENQASIPNCA05A73000017300000120210827102873000001                                             050002039</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/479G    MARTIN                  </IDS>
        <CCR>K09/0428/446G                  </CCR>
        <COF>K001    3:1:1:1      CD71015 01062009                </COF>
        <CCR>K09/0413/447K                  </CCR>
        <COF>K001    5:3:7:1      TH68037 01062009                </COF>
        <CCR>K09/0418/448U                  </CCR>
        <COF>K001    5:6:1:1      TH68072 01062009                </COF>
        <COF>K002    5:8:1:1      TH68081 01062009                </COF>
      </ASI>
      <GMT>000013073ENQR000137R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/479G",
      courtCaseReference: "09/0413/000447K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ROGER"],
        defendantLastName: "MARTIN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68037",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2009-11-01"
            }
          ],
          offenceId: "dff08f0d-9c07-48d4-89bc-26764acdf293"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20003G",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/479G",
      remandDate: "2009-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-01",
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
      <GMH>073ENQR000138RENQASIPNCA05A73000017300000120210827102873000001                                             050002042</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/479G    MARTIN                  </IDS>
        <CCR>K09/0428/446G                  </CCR>
        <COF>K001    3:1:1:1      CD71015 01062009                </COF>
        <CCR>K09/0413/447K                  </CCR>
        <COF>K001    5:3:7:1      TH68037 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4011    01112009                                                                                        </DIS>
        <CCR>K09/0418/448U                  </CCR>
        <COF>K001    5:6:1:1      TH68072 01062009                </COF>
        <COF>K002    5:8:1:1      TH68081 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000138R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/479G",
      courtCaseReference: "09/0413/000447K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2009-11-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68037",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "aa49c170-f966-4079-890a-7f1778ee0e57"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20003G",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/479G",
      remandDate: "2009-11-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-12-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
