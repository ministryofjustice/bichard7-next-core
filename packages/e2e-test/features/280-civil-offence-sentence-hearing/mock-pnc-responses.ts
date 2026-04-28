import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000343RENQASIPNCA05A73000017300000120210901141073000001                                             050002370</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/25W     CIVILCASE               </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:5:8:1      TH68010 26092011                </COF>
        </ASI>
      <GMT>000008073ENQR000343R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADDEDATSENTENCE"],
        defendantLastName: "CIVILCASE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "46bfe02d-fa32-43f2-a20d-6be63db67cf8"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449618X",
      crimeOffenceReferenceNo: "",
      remandResult: "A",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      remandDate: "2011-09-26",
      appearanceResult: "adjourned",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
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
      <GMH>073ENQR000344RENQASIPNCA05A73000017300000120210901141073000001                                             050002373</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/25W     CIVILCASE               </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:5:8:1      TH68010 26092011                </COF>
        <ADJ>IGUILTY       GUILTY        260920110000 </ADJ>
        <DIS>I4011    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000344R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "weeks",
                count: 16
              }
            }
          ],
          offenceId: "c9e0c409-7be5-4751-a079-e92b3f52d436"
        }
      ]
    },
    count: 1
  })
]
