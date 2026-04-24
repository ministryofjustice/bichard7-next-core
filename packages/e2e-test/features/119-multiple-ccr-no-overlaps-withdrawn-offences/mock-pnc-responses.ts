import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000074RENQASIPNCA05A73000017300000120210827074173000001                                             050001861</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000074R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0428/000444E",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      carryForward: {
        appearanceDate: "2011-12-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "3801d797-9e88-4c83-8784-40e0c3152116"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "NOT GUILTY",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "e7d3f9e1-78a2-4cf1-9363-122cdf6d6387"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-12-01"
            }
          ],
          offenceId: "305f9ef6-e035-4cd3-be02-6238a0ba0964"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20002F",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
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
        date: "2011-12-01",
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
      <GMH>073ENQR000075RENQASIPNCA05A73000017300000120210827074373000001                                             050001865</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4011    01122011                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000075R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-12-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-12-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "3d308522-237e-4e3d-b10d-1c6819591849"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-12-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "e94d93d8-6922-4b82-9c6b-f30806b2bbeb"
        }
      ]
    },
    count: 1
  })
]
