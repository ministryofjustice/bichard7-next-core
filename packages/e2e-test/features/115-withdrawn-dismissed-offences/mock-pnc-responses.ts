import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000694RENQASIPNCA05A73000017300000120210903101573000001                                             050002875</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <COF>K003    5:5:2:1      TH68001 28112006                </COF>
        <COF>K004    5:5:6:1      TH68007 28112006                </COF>
      </ASI>
      <GMT>000011073ENQR000694R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      courtCaseReference: "21/2812/000003G",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-05-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DISMISSED"],
        defendantLastName: "OFFENCES"
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
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-05-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "0505f827-2669-4a2d-8826-7a472eeafcc0"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-05-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "1fe82c7d-6814-4aba-a24a-60c6472fd30b"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68001",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "77313579-537e-48bb-a61c-856dcb5d53f8"
        },
        {
          courtOffenceSequenceNumber: 4,
          cjsOffenceCode: "TH68007",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "b844876a-ba17-422c-9e8b-e172de414ba1"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376263Q",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      remandDate: "2009-05-08",
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
      <GMH>073ENQR000695RENQASIPNCA05A73000017300000120210903102073000001                                             050002878</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/24H                   </CCR>
        <COF>K001    5:5:2:1      TH68001 28112006                </COF>
        <COF>K002    5:5:6:1      TH68007 28112006                </COF>
      </ASI>
      <GMT>000016073ENQR000695R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      courtCaseReference: "21/2732/000024H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2008-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DISMISSED"],
        defendantLastName: "OFFENCES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2008-12-02"
            }
          ],
          offenceId: "25f5f69c-013f-4838-a394-7a1e46e8be9c"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68007",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2008-12-02"
            }
          ],
          offenceId: "0e42cbca-00a1-444c-a38c-b3352050c034"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376263Q",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      remandDate: "2008-11-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: ["GIVE TO THE COURT ANY PASSPORT HELD               "],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2008-12-02",
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
      <GMH>073ENQR000696RENQASIPNCA05A73000017300000120210903102073000001                                             050002881</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/24H                   </CCR>
        <COF>K001    5:5:2:1      TH68001 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ>
        <DIS>I4011    02122008                                                                                        </DIS>
        <COF>K002    5:5:6:1      TH68007 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ>
        <DIS>I4011    02122008                                                                                        </DIS>
      </ASI>
      <GMT>000020073ENQR000696R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      courtCaseReference: "21/2732/000024H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2008-12-02",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2009-05-29"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 100
              }
            }
          ],
          offenceId: "d67234b7-4baa-4693-941d-58dc1920a180"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68007",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2009-05-29"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 19
              }
            }
          ],
          offenceId: "f13377b4-f6d7-41c1-8e66-50135c92b8b5"
        }
      ]
    },
    count: 1
  })
]
