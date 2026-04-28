import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000132RENQASIPNCA05A73000017300000120210831090973000001                                             050001947</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/477E    MILES                   </IDS>
        <CCR>K09/0428/442C                  </CCR>
        <COF>K001    5:1:1:1      TH68023 01062009                </COF>
        <CCR>K09/0413/443F                  </CCR>
        <COF>K001    11:1:5:1     FI68068 01062009                </COF>
      </ASI>
      <GMT>000010073ENQR000132R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
      courtCaseReference: "09/0428/000442C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WILLIAM"],
        defendantLastName: "MILES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68023",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "f0e2890d-f3ea-4909-a572-ff0fdcdab713"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20001E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
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
      <GMH>073ENQR000133RENQASIPNCA05A73000017300000120210831090973000001                                             050001950</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/477E    MILES                   </IDS>
        <CCR>K09/0428/442C                  </CCR>
        <COF>K001    5:1:1:1      TH68023 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K09/0413/443F                  </CCR>
        <COF>K001    11:1:5:1     FI68068 01062009                </COF>
      </ASI>
      <GMT>000012073ENQR000133R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
      courtCaseReference: "09/0413/000443F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WILLIAM"],
        defendantLastName: "MILES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "FI68068",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-11-01",
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
          offenceId: "b7d63acf-4f85-4666-9d57-0eb6891ca133"
        }
      ]
    },
    count: 1
  })
]
