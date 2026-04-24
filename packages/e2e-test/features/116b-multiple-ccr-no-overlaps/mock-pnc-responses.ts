import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000134RENQASIPNCA05A73000017300000120210831090973000001                                             050001952</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000134R</GMT>
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
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      carryForward: {
        appearanceDate: "2009-11-01",
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
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "964eb9d9-84c1-45c5-8f30-d66aa07492a6"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "cfda247a-ab72-45ee-a01b-1b3d85e1fb2e"
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
      dateOfConviction: "2009-10-01",
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
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2009-11-01"
            }
          ],
          offenceId: "e93a9df2-7217-43ef-8aa0-b0ec3d24f13b"
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
      <GMH>073ENQR000135RENQASIPNCA05A73000017300000120210831090973000001                                             050001956</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4011    01112009                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000135R</GMT>
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
      dateOfConviction: "2009-11-01",
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
          dateOfSentence: "2009-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 9
              }
            }
          ],
          offenceId: "fdd301fc-e1ec-4261-8247-90a81554f5cf"
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
      appearanceDate: "2009-11-01",
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
          offenceId: "08d259bf-ec0a-49ff-b442-7a6836b1af66"
        }
      ]
    },
    count: 1
  })
]
