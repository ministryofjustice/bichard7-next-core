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
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/17U                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: ""
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000017U",
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
                count: 11
              }
            }
          ],
          offenceId: "6f32a85c-c0b2-4940-a90e-59466c899f6e"
        }
      ]
    }
  })
]
