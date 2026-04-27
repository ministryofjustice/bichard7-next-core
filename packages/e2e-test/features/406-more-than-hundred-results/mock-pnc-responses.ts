import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000155RENQASIPNCA05A73000017300000120210906110373000001                                             050001965</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      ATWOOD                  </IDS>
        <CCR>K21/2732/3K                    </CCR>
        <COF>K001    5:5:1:1      TH68020 09042010                </COF>
        <COF>K002    5:5:1:1      TH68020 09042010                </COF>
        <COF>K003    5:5:1:1      TH68020 09042010                </COF>
        <COF>K004    5:5:1:1      TH68020 09042010                </COF>
        <COF>K005    5:5:1:1      TH68020 09042010                </COF>
        <COF>K006    5:5:1:1      TH68020 09042010                </COF>
        <COF>K007    5:5:1:1      TH68020 09042010                </COF>
        <COF>K008    5:5:1:1      TH68020 09042010                </COF>
        <COF>K009    5:5:1:1      TH68020 09042010                </COF>
        <COF>K010    5:5:1:1      TH68020 09042010                </COF>
        <COF>K011    5:5:1:1      TH68020 09042010                </COF>
        <COF>K012    5:5:1:1      TH68020 09042010                </COF>
        <COF>K013    5:5:1:1      TH68020 09042010                </COF>
        <COF>K014    5:5:1:1      TH68020 09042010                </COF>
        <COF>K015    5:5:1:1      TH68020 09042010                </COF>
        <COF>K016    5:5:1:1      TH68020 09042010                </COF>
        <COF>K017    5:5:1:1      TH68020 09042010                </COF>
        <COF>K018    5:5:1:1      TH68020 09042010                </COF>
        <COF>K019    5:5:1:1      TH68020 09042010                </COF>
        <COF>K020    5:5:1:1      TH68020 09042010                </COF>
        <COF>K021    5:5:1:1      TH68020 09042010                </COF>
        <COF>K022    5:5:1:1      TH68020 09042010                </COF>
        <COF>K023    5:5:1:1      TH68020 09042010                </COF>
        <COF>K024    5:5:1:1      TH68020 09042010                </COF>
        <COF>K025    5:5:1:1      TH68020 09042010                </COF>
        <COF>K026    5:5:1:1      TH68020 09042010                </COF>
        <COF>K027    5:5:1:1      TH68020 09042010                </COF>
        <COF>K028    5:5:1:1      TH68020 09042010                </COF>
        <COF>K029    5:5:1:1      TH68020 09042010                </COF>
        <COF>K030    5:5:1:1      TH68020 09042010                </COF>
        <COF>K031    5:5:1:1      TH68020 09042010                </COF>
        <COF>K032    5:5:1:1      TH68020 09042010                </COF>
        <COF>K033    5:5:1:1      TH68020 09042010                </COF>
        <COF>K034    5:5:1:1      TH68020 09042010                </COF>
        <COF>K035    5:5:1:1      TH68020 09042010                </COF>
        <COF>K036    5:5:1:1      TH68020 09042010                </COF>
        <COF>K037    5:5:1:1      TH68020 09042010                </COF>
        <COF>K038    5:5:1:1      TH68020 09042010                </COF>
        <COF>K039    5:5:1:1      TH68020 09042010                </COF>
        <COF>K040    5:5:1:1      TH68020 09042010                </COF>
        <COF>K041    5:5:1:1      TH68020 09042010                </COF>
        <COF>K042    5:5:1:1      TH68020 09042010                </COF>
        <COF>K043    5:5:1:1      TH68020 09042010                </COF>
        <COF>K044    5:5:1:1      TH68020 09042010                </COF>
        <COF>K045    5:5:1:1      TH68020 09042010                </COF>
        <COF>K046    5:5:1:1      TH68020 09042010                </COF>
        <COF>K047    5:5:1:1      TH68020 09042010                </COF>
        <COF>K048    5:5:1:1      TH68020 09042010                </COF>
        <COF>K049    5:5:1:1      TH68020 09042010                </COF>
        <COF>K050    5:5:1:1      TH68020 09042010                </COF>
        <COF>K051    5:5:1:1      TH68020 09042010                </COF>
        <COF>K052    5:5:1:1      TH68020 09042010                </COF>
        <COF>K053    5:5:1:1      TH68020 09042010                </COF>
        <COF>K054    5:5:1:1      TH68020 09042010                </COF>
        <COF>K055    5:5:1:1      TH68020 09042010                </COF>
        <COF>K056    5:5:1:1      TH68020 09042010                </COF>
        <COF>K057    5:5:1:1      TH68020 09042010                </COF>
        <COF>K058    5:5:1:1      TH68020 09042010                </COF>
        <COF>K059    5:5:1:1      TH68020 09042010                </COF>
        <COF>K060    5:5:1:1      TH68020 09042010                </COF>
        <COF>K061    5:5:1:1      TH68020 09042010                </COF>
        <COF>K062    5:5:1:1      TH68020 09042010                </COF>
        <COF>K063    5:5:1:1      TH68020 09042010                </COF>
        <COF>K064    5:5:1:1      TH68020 09042010                </COF>
        <COF>K065    5:5:1:1      TH68020 09042010                </COF>
        <COF>K066    5:5:1:1      TH68020 09042010                </COF>
        <COF>K067    5:5:1:1      TH68020 09042010                </COF>
        <COF>K068    5:5:1:1      TH68020 09042010                </COF>
        <COF>K069    5:5:1:1      TH68020 09042010                </COF>
        <COF>K070    5:5:1:1      TH68020 09042010                </COF>
        <COF>K071    5:5:1:1      TH68020 09042010                </COF>
        <COF>K072    5:5:1:1      TH68020 09042010                </COF>
        <COF>K073    5:5:1:1      TH68020 09042010                </COF>
        <COF>K074    5:5:1:1      TH68020 09042010                </COF>
        <COF>K075    5:5:1:1      TH68020 09042010                </COF>
        <COF>K076    5:5:1:1      TH68020 09042010                </COF>
        <COF>K077    5:5:1:1      TH68020 09042010                </COF>
        <COF>K078    5:5:1:1      TH68020 09042010                </COF>
        <COF>K079    5:5:1:1      TH68020 09042010                </COF>
        <COF>K080    5:5:1:1      TH68020 09042010                </COF>
        <COF>K081    5:5:1:1      TH68020 09042010                </COF>
        <COF>K082    5:5:1:1      TH68020 09042010                </COF>
        <COF>K083    5:5:1:1      TH68020 09042010                </COF>
        <COF>K084    5:5:1:1      TH68020 09042010                </COF>
        <COF>K085    5:5:1:1      TH68020 09042010                </COF>
        <COF>K086    5:5:1:1      TH68020 09042010                </COF>
        <COF>K087    5:5:1:1      TH68020 09042010                </COF>
        <COF>K088    5:5:1:1      TH68020 09042010                </COF>
        <COF>K089    5:5:1:1      TH68020 09042010                </COF>
        <COF>K090    5:5:1:1      TH68020 09042010                </COF>
        <COF>K091    5:5:1:1      TH68020 09042010                </COF>
        <COF>K092    5:5:1:1      TH68020 09042010                </COF>
        <COF>K093    5:5:1:1      TH68020 09042010                </COF>
        <COF>K094    5:5:1:1      TH68020 09042010                </COF>
        <COF>K095    5:5:1:1      TH68020 09042010                </COF>
        <COF>K096    5:5:1:1      TH68020 09042010                </COF>
        <COF>K097    5:5:1:1      TH68020 09042010                </COF>
        <COF>K098    5:5:1:1      TH68020 09042010                </COF>
        <COF>K099    5:5:1:1      TH68020 09042010                </COF>
        <COF>K100    5:5:1:1      TH68020 09042010                </COF>
      </ASI>
      <GMT>000107073ENQR000155R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ATWOOD",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000003K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-28",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARCUS"],
        defendantLastName: "ATWOOD"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "c1338c6e-e97e-4473-932b-1b7a40f74b1a"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "e1f5b43d-451e-4b1d-8425-18b477f1d123"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "3db6b3e8-9a32-4496-bce5-587713506670"
        },
        {
          courtOffenceSequenceNumber: 4,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "e7334d1c-22d1-4d0b-8ae8-2ff0cf23c6c6"
        },
        {
          courtOffenceSequenceNumber: 5,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "f712cd65-c5b9-4038-978d-89343694a93d"
        },
        {
          courtOffenceSequenceNumber: 6,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "9a934b28-6d52-43a0-8e2b-3289a46d758f"
        },
        {
          courtOffenceSequenceNumber: 7,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "fdb0d8e6-7d59-401d-ae84-57e1981717e7"
        },
        {
          courtOffenceSequenceNumber: 8,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "644e985c-1cef-4c9b-b95f-8862b2023920"
        },
        {
          courtOffenceSequenceNumber: 9,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "207fc2c9-e927-4017-86eb-e0a59485a788"
        },
        {
          courtOffenceSequenceNumber: 10,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "6d658eb6-a761-4fa5-a309-dff58ccbf441"
        },
        {
          courtOffenceSequenceNumber: 11,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "a9e7ff72-9897-43cb-a116-15b83fccd797"
        },
        {
          courtOffenceSequenceNumber: 12,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "0fd3c864-87fa-4b05-8450-68c2be512421"
        },
        {
          courtOffenceSequenceNumber: 13,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "96519318-9a63-4101-b78c-b2924458e9f9"
        },
        {
          courtOffenceSequenceNumber: 14,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "1c7ec277-1ecc-4cb9-ba90-5b140293365f"
        },
        {
          courtOffenceSequenceNumber: 15,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "ce18666b-32a4-4b42-a4d5-e8714ba5bd2c"
        },
        {
          courtOffenceSequenceNumber: 16,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "d8950c47-fd8d-4eec-b12d-7f2a8cf08112"
        },
        {
          courtOffenceSequenceNumber: 17,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "6cbafded-55e3-49a8-8091-96d9e6476c95"
        },
        {
          courtOffenceSequenceNumber: 18,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "065f7789-2c2a-40ac-9650-c79ef2903cba"
        },
        {
          courtOffenceSequenceNumber: 19,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "9fc8bbdf-002f-4bc6-9682-df63ac6902d6"
        },
        {
          courtOffenceSequenceNumber: 20,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "5e8484a7-0ded-480d-8921-e7ffe285fff2"
        },
        {
          courtOffenceSequenceNumber: 21,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "0c8ef044-1218-45d0-a26b-5791bbcdcf55"
        },
        {
          courtOffenceSequenceNumber: 22,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "b7c594c7-a28e-452d-bbae-455550446482"
        },
        {
          courtOffenceSequenceNumber: 23,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "b93b4210-f983-4dca-8328-1f9c30b6aa23"
        },
        {
          courtOffenceSequenceNumber: 24,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "40022e48-5119-4dab-934c-489ed6964d78"
        },
        {
          courtOffenceSequenceNumber: 25,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "9bf25418-1eb4-41e4-80dd-3eea2d8b4074"
        },
        {
          courtOffenceSequenceNumber: 26,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "108cce23-dc7f-4811-9e23-d4433a545bf2"
        },
        {
          courtOffenceSequenceNumber: 27,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "422d68f2-520a-4ec8-9aa6-09d8f7baf48d"
        },
        {
          courtOffenceSequenceNumber: 28,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "a6bb3747-be10-4678-b4f2-98bf28a8807b"
        },
        {
          courtOffenceSequenceNumber: 29,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "288af03b-7ed6-4640-bf2a-6795fd0173f9"
        },
        {
          courtOffenceSequenceNumber: 30,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "5f6fa201-44db-43dc-bff3-eaa9b055f7d5"
        },
        {
          courtOffenceSequenceNumber: 31,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "daebd896-16da-469c-a6e6-2cb6ea307cf4"
        },
        {
          courtOffenceSequenceNumber: 32,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "7b930b3f-40aa-4360-ac30-2d637c4d860d"
        },
        {
          courtOffenceSequenceNumber: 33,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "f021e11c-8de8-4581-bb48-374e87a46e18"
        },
        {
          courtOffenceSequenceNumber: 34,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2f3876d3-da63-4395-9d3d-3bfcd7f4a265"
        },
        {
          courtOffenceSequenceNumber: 35,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "c33ba369-245e-4f33-95ab-4ce30483d8d4"
        },
        {
          courtOffenceSequenceNumber: 36,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "672bf445-6a82-4910-b7b7-087b75573207"
        },
        {
          courtOffenceSequenceNumber: 37,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "087c9eab-7c96-4b49-a6d5-95aacbb0b30d"
        },
        {
          courtOffenceSequenceNumber: 38,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "8a2d0761-f6fa-4e83-8bf3-1ac662b657ac"
        },
        {
          courtOffenceSequenceNumber: 39,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "1afd2bef-76a8-4c67-b36e-17f22de8dcfe"
        },
        {
          courtOffenceSequenceNumber: 40,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "de009b8f-e8ca-44c7-ae44-a5238e4694c9"
        },
        {
          courtOffenceSequenceNumber: 41,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "066541dc-a064-4fcf-9364-978f459c4e23"
        },
        {
          courtOffenceSequenceNumber: 42,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "e3638607-10e6-4298-8584-90fd08be6c8e"
        },
        {
          courtOffenceSequenceNumber: 43,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "5701c84b-4b5c-4aee-a4a2-1d80218aa89f"
        },
        {
          courtOffenceSequenceNumber: 44,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "455c8b0b-e8b8-4d3f-8100-23cf1c1694f3"
        },
        {
          courtOffenceSequenceNumber: 45,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "0f9b6755-3929-4967-9202-aeaf5ef9787a"
        },
        {
          courtOffenceSequenceNumber: 46,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "b970f002-6a10-462b-95e1-ae6f83c6648d"
        },
        {
          courtOffenceSequenceNumber: 47,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "c40a6315-3719-419c-a375-14b0c555c3b4"
        },
        {
          courtOffenceSequenceNumber: 48,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "7c516c17-adba-4a3a-926e-974ce185fe61"
        },
        {
          courtOffenceSequenceNumber: 49,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "e02fb7b1-9268-4ff9-a6dd-b23fe2ae8cb5"
        },
        {
          courtOffenceSequenceNumber: 50,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "b2a58e2d-da26-4143-ac75-8f25dc7c50c1"
        },
        {
          courtOffenceSequenceNumber: 51,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "d8534730-07af-4169-bebb-3d942a69a0d8"
        },
        {
          courtOffenceSequenceNumber: 52,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "0a17c453-0a3e-4e88-97df-c87b0ee8e938"
        },
        {
          courtOffenceSequenceNumber: 53,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "a671eb3e-072f-4877-9946-60a14ca25975"
        },
        {
          courtOffenceSequenceNumber: 54,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "589e2396-f564-4775-b9b9-057a5609f7ca"
        },
        {
          courtOffenceSequenceNumber: 55,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "a566c16d-4cb3-4202-b84f-3e8b7fe369fa"
        },
        {
          courtOffenceSequenceNumber: 56,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "f1507c98-1955-4d1e-be30-fe26eb8cbfa1"
        },
        {
          courtOffenceSequenceNumber: 57,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "1a1c8041-2189-4d2b-b3f7-f8aacadd3132"
        },
        {
          courtOffenceSequenceNumber: 58,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "68c298e0-17c7-4e8c-b30b-ef3e1b810420"
        },
        {
          courtOffenceSequenceNumber: 59,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "25200fd9-81d6-4979-851a-10fd16e75be8"
        },
        {
          courtOffenceSequenceNumber: 60,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "13af317c-cfa3-4092-b604-9e08ef5e79ff"
        },
        {
          courtOffenceSequenceNumber: 61,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "3b1123fb-fae5-46fe-981f-7b9b17c5e40d"
        },
        {
          courtOffenceSequenceNumber: 62,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "f4862438-e220-4c77-9102-c5b6e94db144"
        },
        {
          courtOffenceSequenceNumber: 63,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "de09aae0-1120-472a-a16f-fe3ac9677a09"
        },
        {
          courtOffenceSequenceNumber: 64,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "5406df05-198e-45af-90b9-b108486d42b8"
        },
        {
          courtOffenceSequenceNumber: 65,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "81976487-48b6-480f-88d0-7545878e7bf2"
        },
        {
          courtOffenceSequenceNumber: 66,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "aeae32d7-28ec-445b-8b67-5edea95d2c2c"
        },
        {
          courtOffenceSequenceNumber: 67,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "f6320c3f-b376-4bde-b8c1-cd8823d9e0c8"
        },
        {
          courtOffenceSequenceNumber: 68,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "760c7199-50b2-4282-aa2d-29ac5a154e97"
        },
        {
          courtOffenceSequenceNumber: 69,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "eb13cce7-7cfb-4c7c-ab6b-599f7d5e98ef"
        },
        {
          courtOffenceSequenceNumber: 70,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "8b7c3207-50dc-4252-93ad-c435bd6d37cc"
        },
        {
          courtOffenceSequenceNumber: 71,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "dde7e7e5-30bd-45e2-abd4-052d38233048"
        },
        {
          courtOffenceSequenceNumber: 72,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "1a24c48a-e9bb-420f-968d-652a4b1a66a0"
        },
        {
          courtOffenceSequenceNumber: 73,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2501f2ec-b722-49bd-9864-fa94f778e28a"
        },
        {
          courtOffenceSequenceNumber: 74,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "d77040cc-69d1-4792-a2da-338687cb6dff"
        },
        {
          courtOffenceSequenceNumber: 75,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "0128fed0-5ada-4833-aed3-a51595b53474"
        },
        {
          courtOffenceSequenceNumber: 76,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "82522b19-93b6-4b2d-b8ba-209a849970da"
        },
        {
          courtOffenceSequenceNumber: 77,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "864af382-dc0f-484b-bed0-f9ae64527fcb"
        },
        {
          courtOffenceSequenceNumber: 78,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "ca2e5afb-a6c5-4411-9be1-989f92d9283f"
        },
        {
          courtOffenceSequenceNumber: 79,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "19f585ea-e533-4342-9514-46d7db623404"
        },
        {
          courtOffenceSequenceNumber: 80,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "d4c1c932-fc15-440f-9d6c-7eb8ac4ecd9c"
        },
        {
          courtOffenceSequenceNumber: 81,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2973f700-4e16-4e95-98c4-f88a50ba4f90"
        },
        {
          courtOffenceSequenceNumber: 82,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "3ea53aa7-7917-4576-852b-c4dc9db54c2d"
        },
        {
          courtOffenceSequenceNumber: 83,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "d46a1da4-6b48-4777-8f8d-a682dd7686cf"
        },
        {
          courtOffenceSequenceNumber: 84,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "3a21a2e2-00fc-4583-825b-e12eb20ad9aa"
        },
        {
          courtOffenceSequenceNumber: 85,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "dabf2e57-0a1e-418e-bc2e-a12daacd158c"
        },
        {
          courtOffenceSequenceNumber: 86,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2313618d-8d41-46e6-a9fc-53fb02e37895"
        },
        {
          courtOffenceSequenceNumber: 87,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "453c6f00-fbe6-40d7-9ed5-63f01fcb0225"
        },
        {
          courtOffenceSequenceNumber: 88,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "5804e799-2b90-4961-ae6c-9a032c872582"
        },
        {
          courtOffenceSequenceNumber: 89,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2830fbe0-2a5d-4884-8833-054ba5eec56b"
        },
        {
          courtOffenceSequenceNumber: 90,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "b9bee874-8eb6-48e1-a8a0-7352b278f580"
        },
        {
          courtOffenceSequenceNumber: 91,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "563600a0-f201-41c9-aa55-b3f9da971809"
        },
        {
          courtOffenceSequenceNumber: 92,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "44ba35ef-b1c6-4a0e-a840-21530f68f2c6"
        },
        {
          courtOffenceSequenceNumber: 93,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "aa2aa808-42fd-41f2-8a09-53f06f1d7cae"
        },
        {
          courtOffenceSequenceNumber: 94,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "64f5aa64-10fe-4a94-9946-8618b69d7924"
        },
        {
          courtOffenceSequenceNumber: 95,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "32a361cd-d338-4e4c-adac-fce7789f826a"
        },
        {
          courtOffenceSequenceNumber: 96,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "34f0fae6-86b9-482c-bb68-232259f2e766"
        },
        {
          courtOffenceSequenceNumber: 97,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "a85518a0-a061-4ef9-a1b2-389b78b9608a"
        },
        {
          courtOffenceSequenceNumber: 98,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "acecfce7-7f94-4304-8824-3c00563408cb"
        },
        {
          courtOffenceSequenceNumber: 99,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "87b4ab6d-d9b9-4a4a-bbc8-b0b0d207125d"
        },
        {
          courtOffenceSequenceNumber: 100,
          cjsOffenceCode: "TH68020",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "cc093cb5-c8b2-47bb-ab24-a5ea4db16ab1"
        }
      ]
    },
    count: 1
  })
]
