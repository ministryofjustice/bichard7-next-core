import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXE01>
      <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
      <ASI>
        <FSC>K04CA</FSC>
        <IDS>K12/14X     AVALON                  </IDS>
        <CCR>K12/2732/15R                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/16T                   </CCR>
        <COF>K001    1:9:7:1      SX03001A01062009                </COF>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: ""
  }),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02.*SX03001A",
    count: 1,
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000016T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "AVALON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 11
              }
            }
          ],
          offenceId: "d03a0417-16b6-49ad-9ef8-3d17e38ffdbf"
        },
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "SX03001",
          roleQualifiers: ["AT"],
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "8e9bf65e-9543-422a-a1d8-71961dc4eeea"
        }
      ]
    }
  }),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02.*I1002M10",
    count: 1,
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000015R",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "AVALON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            },
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0297c203-5a16-4ca4-a025-30bc1fedcb35"
        }
      ]
    }
  })
]
