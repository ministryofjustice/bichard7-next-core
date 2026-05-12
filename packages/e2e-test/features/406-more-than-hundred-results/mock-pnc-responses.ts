import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ATWOOD",
      croNumber: "",
      gmh: "073ENQR000155RENQASIPNCA05A73000017300000120210906110373000001                                             050001965",
      gmt: "000107073ENQR000155R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/4Y",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410923P",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000003K",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "76861424-1ee8-4635-b854-b15d5446e7b3",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "cc4834f2-9266-4f8c-a75d-54e6a9a3bb62",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "2d94e6d8-a5d0-43b6-8821-400698960312",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 4,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "3c335d23-e34d-4df5-9a93-358d9aab3034",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 5,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "f3a22e0d-e9b1-4ac8-bf9c-94477839bc5b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 6,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "a0257b00-9abb-4475-987e-636087ab5d32",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 7,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "5445022d-4231-493c-95b1-fd1ef827de54",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 8,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "3a3285af-f3ff-4464-a89a-5ff16ff8d855",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 9,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "eea007d2-7ddb-4ce9-8711-09113553f7e9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 10,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "23bc1984-ff4e-4d4c-9cc3-0d89da3678bf",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 11,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "ca5d4cc7-31a6-40e1-8174-2f0096f4eaa7",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 12,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "2f005137-e4cc-46d5-8d39-40de1a48d80f",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 13,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "65a36f58-be5b-4ba9-985d-2467b939aabb",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 14,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "95d3588f-1fa9-4b37-8937-5364f6381897",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 15,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "ad5de6eb-b8f4-4669-bfcf-d68f98355217",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 16,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "622ad7be-cfd3-4685-ab41-7fb7f8c2b7ed",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 17,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "d67e5033-8655-4b1e-907e-4420a78c4a6f",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 18,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "128859e6-e597-4187-b2d7-29b6942b5c4d",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 19,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "5bcf40de-8cef-4457-a30f-5b67cdd9538b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 20,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "7ee68305-1fb6-4c2d-8f21-08024a81b7eb",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 21,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "af8d9945-722e-4c31-b3af-c4d012bef9a5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 22,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "57f728b7-498d-49ae-8e09-6715421450da",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 23,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "3e86e045-c6ed-43ec-81e5-acc34f8fb2d9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 24,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "65853791-8407-4cc8-a852-e9681a055b91",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 25,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "68c5b349-554e-4491-b37c-03df10b6d77c",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 26,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "4d0b6041-0180-4d94-b1e5-63a307a8fdc8",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 27,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "599b6ed6-b2f9-4c56-9fa7-9e9e5bbaad17",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 28,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "1e9c6cd9-5922-46d1-8431-12309de929cd",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 29,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "9d43ab2e-3c1f-4fc9-b9e5-f6ce34dfc82a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 30,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "7164da51-1e27-4746-a0a5-7e5754dbd05e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 31,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "424f8a1c-da4f-4941-b029-2e4d73ba4850",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 32,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "a67a36f8-9c38-4044-b2df-a5521b951e48",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 33,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "2335508f-1b37-4031-9ad1-2ae41a3e2bca",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 34,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "f8657422-8449-4255-92d0-4640fe4fc950",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 35,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "45ee9cac-f922-4a95-bd26-8d4033673d15",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 36,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "745d8093-b9fc-49dd-8050-0324352f666e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 37,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "abe9807b-eae6-42ff-9f17-9e1d1df6ee25",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 38,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c69997e7-5d52-4e95-93d7-5351e16b485a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 39,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "2fcff164-3c92-4d26-a715-1f2e4f63d052",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 40,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c31e0d76-52a8-407b-9ed5-eb68ad996624",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 41,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "b0dbee53-6bd4-489f-b1fc-e059620d48c4",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 42,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c48a1ebc-e720-4780-8313-fc5c2fb78fa2",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 43,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "cb79898d-f177-4031-9312-60880ad5e3b6",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 44,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "93f65bdb-71f2-4cc9-a07e-d8b7e7e9a6ae",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 45,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "d3ea29cc-1246-4ad5-aced-e6d8fecb1067",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 46,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "3ee69540-33e1-4367-a99d-5a9f216860e3",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 47,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "bdbf1e3d-ed92-4925-9c29-fd3cc30add95",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 48,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "2c7c1c5d-1498-476b-8f3e-b2716f071ef9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 49,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c1dfed9c-cac5-48ca-8dda-91c6a7bbf651",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 50,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "40964c61-34db-45db-a42c-f13e562a81ad",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 51,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "e33d2a22-84af-40ab-846c-6b31202e6cf3",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 52,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c49a9c19-714f-486c-b82b-5ad7f022e7da",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 53,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "5ae85a0f-534d-4bad-8de5-3b3ee81ed736",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 54,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "364c525f-1322-4269-bab3-83ad9bcc8510",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 55,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "fc4595ba-ec30-4991-8251-648340aaf2d0",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 56,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "e4f76b30-c2da-4518-8772-d013c6d279d4",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 57,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "9376f2cc-58fc-4740-90f6-10cd7f27c30a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 58,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "4ea9f1e1-604a-4c4a-918b-28009503df66",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 59,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "f3d00367-80ca-47cd-8d88-2a692a3e91fd",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 60,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "ccd2cb63-abce-4342-bea6-06e3ae8f61d0",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 61,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "887ee45d-9286-4065-9099-2420c5cc45c6",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 62,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "013180fa-934a-43c9-9666-994b2345b462",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 63,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "33a2eee1-7a40-49e6-a89c-e675616ef828",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 64,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "853a5f55-ea3e-498a-94e0-ddcc733b3fad",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 65,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "f1715a7e-b84d-4e5b-8bb0-d9c965cbaa7e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 66,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "5c4adb2c-03e8-4cb3-b6d9-5b77b2bd4f51",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 67,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "210ca41c-0585-493c-ba5d-0190fb3d0e4d",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 68,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "978184c8-3d2c-4dae-bbff-23c1cb1c3270",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 69,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "69e14d54-f602-4877-84a0-ae301e91c0c6",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 70,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "03619243-f9d2-475d-91b7-fe6bb83d7cf8",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 71,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "d3349127-0399-44e1-8ec4-9b8a55a93c49",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 72,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "e3955208-df53-432b-a677-6ae2ce25d8f5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 73,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c2f5e840-4a18-4249-8f9f-b2090598774a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 74,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "b46fdc53-40a8-468c-a9e9-e0a8552a3783",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 75,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "77e39813-1a5c-42dc-b02c-8dbb28344e43",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 76,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "6aa2d678-0a47-4222-a579-2f33e4f519f5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 77,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "14525077-dfa8-438f-9557-139f6dd1518e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 78,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "470722fd-f5f7-4a1f-b859-7bdf48d4088a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 79,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "5517c2c9-4b5c-4cdb-ba99-f602fe53219b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 80,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "f0cb54f7-f59b-4bff-a3f6-7c1921d6eaa9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 81,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "1dbf7d87-69a5-49a0-881a-066b3bb4929a",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 82,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "0300805c-c16c-48a8-b94e-2ec5c9659eac",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 83,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "e6479ef4-c84c-4b9d-8881-9f34ff4fbebc",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 84,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "e75fab4f-b5a3-4299-b585-c9475adf5d91",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 85,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "a890b5e9-9f01-4a38-8703-76cd1b8fec73",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 86,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "4126d547-4c55-41e8-b225-825e7764141b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 87,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "71a1187b-7686-424d-b899-a8a1c514589e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 88,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "6bc443c5-5ef1-4037-81a7-67966be16571",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 89,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "ad440fae-38a6-4cdf-b034-7d78c614320e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 90,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "0d36eb25-dd44-49c1-96f7-f0e9991dd3e3",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 91,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "cb8011d6-366b-43b2-ad67-15fcc6326ddc",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 92,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "bdd96f89-6eab-41c8-b516-618d1fbdb78b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 93,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "3dfa702a-a8ed-45a9-8c0f-158d6f1b6877",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 94,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "065deffc-755a-4bf5-b8aa-1b18be91ebcc",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 95,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "b8f4df55-4e3d-4b31-b970-0dc317f70e95",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 96,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "fb27726f-9b74-458e-8a99-1bfb8361891d",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 97,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "cc28935f-7fce-41c2-91ca-624a08d43fcf",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 98,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "c82fbe9a-5da1-4e18-80bf-80d32f8af8b9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 99,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "7aaecd06-8240-425d-9cad-fe2804797e3b",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:1:1",
              courtOffenceSequenceNumber: 100,
              cjsOffenceCode: "TH68020",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-04-09",
              offenceId: "9e961a6f-fd86-4315-a421-b5491288c3e4",
              disposalResults: []
            }
          ]
        }
      ]
    },
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
      personUrn: "2021/4Y",
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
