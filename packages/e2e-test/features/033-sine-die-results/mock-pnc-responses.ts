import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000306RENQASIPNCA05A73000017300000120210901124873000001                                             050002291</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/6A      LEBOWSKI                </IDS>
        <CCR>K21/2732/6N                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <COF>K003    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000010073ENQR000306R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/6A",
      courtCaseReference: "21/2732/000006N",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JEFFREY"],
        defendantLastName: "LEBOWSKI"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "8d498e79-8039-417c-a326-911249334087"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "1dd6ed94-a753-4b10-97f4-ac349b1df812"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "45e509be-29a4-4bcc-92bc-f735f7da34a7"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000307RENQASIPNCA05A73000017300000120210901124873000001                                             050002293</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/6A      LEBOWSKI                </IDS>
        <CCR>K21/2732/6N                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K003    12:15:13:1   RT88191 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
      </ASI>
      <GMT>000016073ENQR000307R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU03", {
    expectedRequest: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/6A",
      courtCaseReference: "21/2732/000006N",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Subsequently Varied",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 101
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "665ece7c-60f9-486c-872b-f68bc21c337d"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 102
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "904dcc48-0e56-4fcb-8d53-93a7f5cd5060"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 103
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "2ee6f868-76fd-4ab0-9b0e-15945a7ce62e"
        }
      ]
    },
    count: 1
  })
]
