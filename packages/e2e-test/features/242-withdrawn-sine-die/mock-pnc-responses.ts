import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SINEDIE",
      croNumber: "",
      gmh: "073ENQR000720RENQASIPNCA05A73000017300000120210903102573000001                                             050002933",
      gmt: "000009073ENQR000720R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/22T",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448653Z",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000016Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "2590df4e-fe23-47f3-a4ea-029d52b1d34e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "7faedcdc-7b35-4151-a1bd-c308034fd6d8",
              disposalResults: []
            }
          ]
        }
      ]
    },
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
      personUrn: "2021/22T",
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
    response: {
      pncCheckName: "SINEDIE",
      croNumber: "",
      gmh: "073ENQR000721RENQASIPNCA05A73000017300000120210903102573000001                                             050002935",
      gmt: "000013073ENQR000721R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/22T",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448653Z",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000016Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "No Plea Taken",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "aba6419f-145a-4f86-8ec3-0aeead55e061",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "e8d03f70-758a-4a4e-aa11-550029df4f44",
                  disposalDate: "2011-09-26",
                  adjudication: "Non-Conviction"
                }
              ],
              disposalResults: [
                {
                  disposalId: "0556c3e6-b96b-4e2f-b8fe-f59b9eb7db27",
                  disposalCode: 2007,
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "No Plea Taken",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "185609ab-80ee-421a-82db-5d0d00f8882e",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "77b5117a-6152-4b2f-a45e-6fe48f2e434d",
                  disposalDate: "2011-09-26",
                  adjudication: "Non-Conviction"
                }
              ],
              disposalResults: [
                {
                  disposalId: "ed366293-c0f3-489a-b8c2-cd10d685973b",
                  disposalCode: 2007,
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
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
      personUrn: "2021/22T",
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
