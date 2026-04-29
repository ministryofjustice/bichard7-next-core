import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000720RENQASIPNCA05A73000017300000120210903102573000001                                             050002933</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     SINEDIE                 </IDS>
        <CCR>K21/2732/16Z                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000720R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SINEDIE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/22T",
      courtCaseReference: "21/2732/000016Z",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WITHDRAWN"],
        defendantLastName: "SINEDIE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "8b7b06b2-ac06-4099-8f74-cac01c15e7c7"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "4fccfc8e-c5bf-466f-ae90-b12447ec9198"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000721RENQASIPNCA05A73000017300000120210903102573000001                                             050002935</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     SINEDIE                 </IDS>
        <CCR>K21/2732/16Z                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
      </ASI>
      <GMT>000013073ENQR000721R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU03", {
    expectedRequest: {
      pncCheckName: "SINEDIE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/22T",
      courtCaseReference: "21/2732/000016Z",
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
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2063
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-26"
            }
          ],
          offenceId: "d8bc6800-23bb-45d1-8ccf-8abb3b756f54"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2063
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-26"
            }
          ],
          offenceId: "67dc6514-a96f-49a0-96f5-34bb8535bf7c"
        }
      ]
    },
    count: 1
  })
]
