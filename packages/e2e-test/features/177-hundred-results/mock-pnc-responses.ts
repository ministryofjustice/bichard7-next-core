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
          offenceId: "b9c0517e-3585-45c7-bb77-ac841cc6d8e3"
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
          offenceId: "e5317c49-7049-4147-8d55-bb382df4284a"
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
          offenceId: "892dc939-2938-4a8e-a685-8ab5f2b1eec4"
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
          offenceId: "70ab361b-bf91-4e3f-83bb-9b446adc76fd"
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
          offenceId: "def9d0ae-bf28-4e17-9fea-f971d9fa913a"
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
          offenceId: "0340da78-49e1-4c45-8b04-4a19c99d03fc"
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
          offenceId: "52ea15c8-b8b9-45a6-9b1c-15eed85d9a13"
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
          offenceId: "6279acda-4391-4f23-bc97-7adfa7ffa760"
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
          offenceId: "41da4866-8c16-49af-a61f-305f97cd5ee8"
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
          offenceId: "57f21333-5690-4c41-89c0-47495d8d83fd"
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
          offenceId: "e377b422-cd5f-4924-af05-adb8ac518a0b"
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
          offenceId: "27b224aa-d0c1-4f4e-b0e8-aa0911f3b65b"
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
          offenceId: "ec7b57cb-b685-430b-a56e-dba1f98d7085"
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
          offenceId: "d44a18bf-6b76-4497-9292-64994c53d361"
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
          offenceId: "543bf6c7-5dba-497f-adcd-76b96fc09aae"
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
          offenceId: "e72033c8-0be6-464f-beaa-706af5aec0c5"
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
          offenceId: "3731edc1-2d3a-4b8d-b4af-1df279427ec3"
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
          offenceId: "ccbff57b-f64c-4869-9a21-c4b9f059cb98"
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
          offenceId: "9b637fba-e1ca-41c9-9a13-11e7b91e6ccc"
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
          offenceId: "75b49591-fc3e-41ec-a0ee-392748e752f1"
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
          offenceId: "ee428f3a-b865-44e9-92e9-93a42bfa4926"
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
          offenceId: "e352a77b-133e-4a79-bde9-dfa8003731ae"
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
          offenceId: "61077f00-874b-40bd-a00b-86af73530d4f"
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
          offenceId: "71608ec7-1b1a-4e19-93ab-70f4078611f6"
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
          offenceId: "6936044c-6dad-4683-8cf8-f2427e7b2ed1"
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
          offenceId: "f4e4fa7d-c5f8-451b-83f7-41fab8ae22b3"
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
          offenceId: "180e688b-d164-4673-aa42-09c06a48d0c6"
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
          offenceId: "104c7911-0626-4251-a930-9fec7e7ea158"
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
          offenceId: "19280d73-98ca-4e0e-9d8b-2fc8fffb4abe"
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
          offenceId: "df4c63e6-9960-4456-ab0f-53df1b7786ab"
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
          offenceId: "70f4eaae-1bf4-45e4-a008-f68f4c616934"
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
          offenceId: "9295e722-87dd-4085-b8ea-df71d3c1404a"
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
          offenceId: "b2122316-d4eb-4ea7-8de1-51aff8b8e81f"
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
          offenceId: "c81655af-543c-40d5-9600-c48092070b68"
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
          offenceId: "ab3b4869-8735-468b-8f20-14f89a041974"
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
          offenceId: "0c766ac4-e75c-495d-8bd1-cbb74ed3ab28"
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
          offenceId: "ffdec530-33d2-400b-9678-17f2544934c1"
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
          offenceId: "ef029e6f-df76-4053-b8bb-074064d36fef"
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
          offenceId: "e740b134-e78a-4145-a36f-49f7d2f26036"
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
          offenceId: "aa9d56dc-3831-49d8-b675-f28b127bda6d"
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
          offenceId: "13fffd8f-c70f-4311-8a2c-ca59d06fcbdf"
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
          offenceId: "a4cb7db5-f64e-44ce-97f4-68b283d91f9a"
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
          offenceId: "4439595a-ca73-4e75-b518-316466a14a36"
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
          offenceId: "78bf87a7-6c34-471c-bae2-4eb9984601e8"
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
          offenceId: "8e2ee71a-2862-4567-a0c2-9d91fa6a34e2"
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
          offenceId: "af5869af-f046-469e-97fc-3ad7d7837756"
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
          offenceId: "b17c2016-3397-4b10-be07-48d0aa839c63"
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
          offenceId: "ade2a0c1-cbae-4069-83ff-7fc705d043b7"
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
          offenceId: "088b66a1-bf9d-45d6-8b6d-3bb724877d80"
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
          offenceId: "9e5dbbe4-99f9-4777-a5e3-960d551921b2"
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
          offenceId: "86228ecc-82b2-40bd-854c-44ceddac28c3"
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
          offenceId: "cae9949d-5580-4593-a914-008f59637887"
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
          offenceId: "a1ae4960-a871-4dbd-98d0-c85a1cae8f68"
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
          offenceId: "9b43016e-e39b-4052-b6ae-85bd5e4e9145"
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
          offenceId: "77ad6613-88cc-4070-a3d0-7db1bf8ba5fe"
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
          offenceId: "9be0a7d0-da15-495a-939b-46ef043c4944"
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
          offenceId: "11d96e1f-85c7-4c92-84ba-59c1aee07005"
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
          offenceId: "b959c77e-9206-400d-960e-7b3895c19e57"
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
          offenceId: "48a4727e-55e2-409c-8c56-d3976efa4a22"
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
          offenceId: "69da1c88-9331-4907-b154-00feadffc11b"
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
          offenceId: "7b63d83e-f3d2-4342-96f1-17518fc5ad5a"
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
          offenceId: "24792e29-5077-4ae4-8401-9166bc45bc85"
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
          offenceId: "d7d62484-0aa4-47ce-814e-983907850551"
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
          offenceId: "6c708437-8885-4a3d-a170-fdcb014cc9b5"
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
          offenceId: "78954900-b67d-4623-834b-724d2278fa6c"
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
          offenceId: "5a1a91c3-baae-4d06-a281-4246130364d6"
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
          offenceId: "8bd59c4d-22cf-4477-9d7a-56c1f001aa4a"
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
          offenceId: "44b0ffc6-2499-4fdf-8e06-77304c089c5e"
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
          offenceId: "8bd7c93d-f527-4627-8b97-32d76be455bb"
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
          offenceId: "43587250-9c45-4448-b1ac-5afa6763b210"
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
          offenceId: "265ebe9d-93e8-4a3b-ad8f-e7a6947fcea7"
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
          offenceId: "fedd2d4b-4f43-42f4-be2c-3a0194093c12"
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
          offenceId: "513d4a31-f602-4c0f-8180-106e7ffe18e5"
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
          offenceId: "7b408f38-c167-4614-81cc-73fd6fdcc5d3"
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
          offenceId: "ab2a6bfb-0667-4a1b-82ad-df53a724cf4d"
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
          offenceId: "2a6869c9-9ec5-43df-b13c-daabf5b52e56"
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
          offenceId: "b7cf62a0-e911-413f-9744-007d3a633f6d"
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
          offenceId: "827c0084-a6d7-4b66-b3a8-26878ce1ae06"
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
          offenceId: "e65d8227-2a21-486b-bfe6-75bb44df65d7"
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
          offenceId: "bc764abb-70c4-4e7c-ba1d-0e9974b7b5ab"
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
          offenceId: "6c35ad5d-f471-4aba-b223-ac3b68e30639"
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
          offenceId: "a0cc993a-51cf-4d42-b4bf-36d245f74b7b"
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
          offenceId: "e70a38c2-edbb-4c0d-801f-00e0d2b63251"
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
          offenceId: "f3684a22-50ef-487d-a751-bcd2f795cb0c"
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
          offenceId: "4a4d0d7e-af77-487d-b1d7-3f2c83e1ace1"
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
          offenceId: "3973a9d7-94f5-4498-92dd-d3ef25d5ffb2"
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
          offenceId: "80c6ec71-a515-4a7b-a85b-1d632e09ca8c"
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
          offenceId: "5fa3edde-7407-4e07-abc1-8f93dea0bf1b"
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
          offenceId: "9381be36-f03c-4c25-9444-ec631d9e534d"
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
          offenceId: "9b6d3823-16c2-4b19-bb11-c56d3e527481"
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
          offenceId: "35ab3e9e-c228-4258-ad74-f12523ea1012"
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
          offenceId: "0dbd8283-1471-49f0-86d2-4a23940a5404"
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
          offenceId: "b0f0d758-a093-4a9e-83eb-f1a7c2576a14"
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
          offenceId: "de4dd05d-1ec7-4988-8a03-dde2035aa5cd"
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
          offenceId: "dbe18f28-4f7f-4c9a-bbfe-d3810d9ed47a"
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
          offenceId: "7ce826a7-4928-402d-89f7-605445ccd8a1"
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
          offenceId: "868c6f90-b556-493c-aa7b-1cd985757356"
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
          offenceId: "76831ae1-8bf8-42be-9b58-02a6c932f572"
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
          offenceId: "e0155475-f913-4388-84f4-df9cb3cac7e3"
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
          offenceId: "d6099118-fd70-4be0-8db4-18b0fcc0bec5"
        }
      ]
    },
    count: 1
  })
]
