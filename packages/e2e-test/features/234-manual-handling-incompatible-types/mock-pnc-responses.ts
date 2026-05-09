import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "NOLAN",
      croNumber: "",
      gmh: "073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772",
      gmt: "000008073ENQR004540S",
      personId: "4f2ad48a-351c-4eb0-85e6-3d283b2188de",
      personUrn: "09/494Y",
      reportId: "a75df3ed-089e-463f-9bc0-ce67f80b6c64",
      asn: "0900000000000020005J",
      ownerCode: "01AB",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "7fa95fa5-db97-4699-9c95-51d443b145ca",
          courtCaseReference: "",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2008-07-06",
              offenceId: "2dcbe031-6ab3-4fa8-907f-211ca7fa0f8e",
              disposalResults: [
                {
                  disposalId: "78c824fb-7b73-485c-99da-6a296750aed8",
                  disposalCode: 1109,
                  disposalEffectiveDate: "00-0.-10",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.generateDummyUpdate()
]
