import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000053RENQASIPNCA05A73000017300000120210827114073000001                                             050001816</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K13/2Z      NOEXCEPTION             </IDS>
        <CCR>K13/2732/1U                    </CCR>
        <COF>K001    5:5:8:1      TH68010 01102010                </COF>
        <CCR>K13/2732/2V                    </CCR>
        <COF>K001    5:5:9:1      TH68012 01102010                </COF>
      </ASI>
      <GMT>000010073ENQR000053R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOEXCEPTION",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "13/2Z",
      courtCaseReference: "13/2732/000001U",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADDEDOFFENCE"],
        defendantLastName: "NOEXCEPTION"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "8b4fd0d1-2d71-4a68-be9b-ba6be3f1d4c0"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOEXCEPTION",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "13/2Z",
      courtCaseReference: "13/2732/000002V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADDEDOFFENCE"],
        defendantLastName: "NOEXCEPTION"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68012",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 4
              }
            }
          ],
          offenceId: "53f55004-df01-45a6-94ba-266ba2e6e612"
        }
      ]
    },
    count: 1
  })
]
