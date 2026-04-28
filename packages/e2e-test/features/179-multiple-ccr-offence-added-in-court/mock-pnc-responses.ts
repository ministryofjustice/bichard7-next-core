import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000136RENQASIPNCA05A73000017300000120210831091373000001                                             050001959</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/16Z     LANCASTER               </IDS>
        <CCR>K12/2732/22Z                   </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/23A                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000136R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LANCASTER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/16Z",
      courtCaseReference: "12/2732/000022Z",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LANCASTER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
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
          offenceId: "13b37732-ab61-4c68-bbee-8567fe198fad"
        },
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 13
              }
            }
          ],
          offenceId: "c47bd5b3-f1e6-4c80-a6b3-64fc700fade6"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000137RENQASIPNCA05A73000017300000120210831091473000001                                             050001961</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/16Z     LANCASTER               </IDS>
        <CCR>K12/2732/22Z                   </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M13                                                                                                 </DIS>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
        <CCR>K12/2732/23A                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000137R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LANCASTER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/16Z",
      courtCaseReference: "12/2732/000023A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-20",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LANCASTER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-20",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            }
          ],
          offenceId: "12d71d51-9ebe-4802-bfc7-54569c2653fd"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/8V",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68151"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-20",
              offenceTic: 0,
              offenceStartDate: "2006-11-02",
              disposalResults: [
                {
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 14
                  }
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    },
    count: 1
  })
]
