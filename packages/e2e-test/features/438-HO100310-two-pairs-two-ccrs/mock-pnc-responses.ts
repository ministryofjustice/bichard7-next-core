import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
      <CXE01>
        <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
        <ASI>
          <FSC>K01ZD</FSC>
          <IDS>K00/410801G Bass                    </IDS>
          <CCR>K97/1626/8395Q                 </CCR>
          <COF>K001    12:15:24:1   TH68010 250920100000            </COF>
          <COF>K002    12:15:24:1   TH68010 250920100000            </COF>
          <CCR>K97/1626/8396R                 </CCR>
          <COF>K001    12:15:24:1   BG73001 250920120000            </COF>
          <COF>K002    12:15:24:1   BG73001 250920120000            </COF>
        </ASI>
        <GMT>000008073ENQR004540S</GMT>
      </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: ""
  }),
  policeApi.mockUpdate("CXU02", {
    count: 1,
    expectedRequest: {
      pncCheckName: "BASS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410801G",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BARRY"],
        defendantLastName: "BASS"
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
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "54c2ae88-057d-4cc3-acc4-ddc90e450d4f"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "2032651e-d61e-4941-a3bd-67ce91c509c1"
        }
      ]
    }
  }),
  policeApi.mockUpdate("CXU02", {
    count: 1,
    expectedRequest: {
      pncCheckName: "BASS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410801G",
      courtCaseReference: "97/1626/008396R",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BARRY"],
        defendantLastName: "BASS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "BG73001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "97a9840b-1835-4bf0-b24c-38cb15a875d1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "BG73001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "520a964c-4191-43f8-abfc-0f2d592dbc67"
        }
      ]
    }
  })
]
