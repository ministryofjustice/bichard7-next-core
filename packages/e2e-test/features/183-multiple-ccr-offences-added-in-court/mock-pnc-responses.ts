import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000051RENQASIPNCA05A73000017300000120210827111573000001                                             050001811</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/20D     LIVERPOOL               </IDS>
        <CCR>K12/2732/30H                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K12/2732/31J                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000051R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/20D",
      courtCaseReference: "12/2732/000030H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LIVERPOOL"
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
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-08"
            }
          ],
          offenceId: "99b21489-fe0a-4dc7-9a6c-3aec412ba745"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-08"
            }
          ],
          offenceId: "471a5436-c0b3-456d-aa5e-27613d004625"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/12Z",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/20D",
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
        date: "2009-10-08",
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
      <GMH>073ENQR000143RENQASIPNCA05A73000017300000120210827111573000001                                             050002053</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/20D     LIVERPOOL               </IDS>
        <CCR>K12/2732/30H                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4004    08102009                                                                                        </DIS>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4004    08102009                                                                                        </DIS>
        <CCR>K12/2732/31J                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000143R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/20D",
      courtCaseReference: "12/2732/000030H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2009-10-08",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "d4999c29-37f4-4537-bebb-5b3f512027e4"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "7d6872b4-3db0-4229-86c7-6be37d6c93f5"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/20D",
      courtCaseReference: "12/2732/000031J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LIVERPOOL"
      },
      carryForward: {
        appearanceDate: "2009-10-12",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "NOT GUILTY",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "a0d0151e-afe1-4f16-997c-495284998ade"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/12Z",
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
              dateOfSentence: "2009-10-08",
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
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/12Z",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/20D",
      remandDate: "2009-10-08",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-12",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
