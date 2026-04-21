import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000140RENQASIPNCA05A73000017300000120210831093073000001                                             050001967</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/24H     HARMON                  </IDS>
        <CCR>K12/2732/41V                   </CCR>
        <COF>K001                 RR84042 01062009                </COF>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/42W                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000140R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HARMON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      courtCaseReference: "12/2732/000041V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-09",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "HARMON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-09",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2004
            }
          ],
          offenceId: "586e2082-8e80-4076-b703-4e3882cf83ab"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-09",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2004
            }
          ],
          offenceId: "2fa52a99-549b-4a42-be8e-c78e452f7713"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HARMON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/16D",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      remandDate: "2009-10-09",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-19",
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
      <GMH>073ENQR000141RENQASIPNCA05A73000017300000120210831093073000001                                             050001970</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/24H     HARMON                  </IDS>
        <CCR>K12/2732/41V                   </CCR>
        <COF>K001                 RR84042 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    091020090000 </ADJ>
        <DIS>I2004                                                                                                    </DIS>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    091020090000 </ADJ>
        <DIS>I2004                                                                                                    </DIS>
        <CCR>K12/2732/42W                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000141R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HARMON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      courtCaseReference: "12/2732/000042W",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-19",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "HARMON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-19",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-21"
            }
          ],
          offenceId: "f427b4ca-4c81-4255-b61f-7822928ac125"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/16D",
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
              dateOfSentence: "2009-10-19",
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
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HARMON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/16D",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      remandDate: "2009-10-19",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-21",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
