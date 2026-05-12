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
      personUrn: "21/4Y",
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
              offenceId: "96eb8563-31c9-4a2d-a9cb-790df931f106",
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
              offenceId: "30f32f01-59ae-400b-9748-3b93016b4a32",
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
              offenceId: "46fd8693-ca91-4b98-8e41-d9a60b2629e5",
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
              offenceId: "4d56046a-d3c9-45f7-8178-ecdb4c9d2be2",
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
              offenceId: "b3389796-6b0b-4549-8efa-58bb680a35bb",
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
              offenceId: "a9bbbe1c-c0de-4e55-acf3-a9127d5bb002",
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
              offenceId: "900153ba-ded1-46b6-83ac-75ed7e632461",
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
              offenceId: "99e8fcd8-8855-4887-bdbf-a7bf75c113cf",
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
              offenceId: "88f5dc68-ded6-4a91-9d56-df3e85c050fc",
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
              offenceId: "8933219d-5d96-4240-b822-4bcfcb148293",
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
              offenceId: "a5a2a7be-e704-43f1-86fc-aa59aab4ec47",
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
              offenceId: "d3781700-ad0a-4229-80c4-83beb0eaa689",
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
              offenceId: "355563c8-e30d-4966-bb15-a54c5d16700d",
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
              offenceId: "3067e0b0-97b8-4483-bb30-f682fff0811c",
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
              offenceId: "ae59512d-a9a7-4a46-826d-52b5fb5484dd",
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
              offenceId: "46757e7c-606f-44d8-b60b-1054f9262b09",
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
              offenceId: "408c4827-3b28-44c9-83ab-71cac8bbc888",
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
              offenceId: "aa8016c8-7250-4b31-9001-e69e1329a6ac",
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
              offenceId: "3246a6d7-8bd7-4e1b-922f-5ea0fdb45dc9",
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
              offenceId: "97003023-bdae-40a2-a74f-4848523f52fd",
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
              offenceId: "7968cb62-7644-4ebc-a16e-ddb736b27d98",
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
              offenceId: "15c2cdb7-5f6b-4aca-acf0-19fb09af0008",
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
              offenceId: "532a9821-5d3a-4afa-8214-90bee0257fde",
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
              offenceId: "17ef1990-c2e9-44b7-bd9b-e563f948d3a6",
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
              offenceId: "82462907-e43a-4e79-a0fe-eb74ad25335e",
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
              offenceId: "8ab41a1d-2d62-44db-bd6c-85f8e92672b0",
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
              offenceId: "fe8f29b7-8c43-43ca-87ec-c420a1ba5544",
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
              offenceId: "df7a8dd1-9d69-4413-9eeb-04091a866033",
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
              offenceId: "66578573-50a5-463e-94a1-f6fee391f9f0",
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
              offenceId: "3ff513bf-4a5d-4cb5-a4f4-644860c28668",
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
              offenceId: "8a58d527-4d95-4b2e-bf76-842de29a3e0e",
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
              offenceId: "0000edb4-1a28-4e8d-bc38-b28ff49167fb",
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
              offenceId: "6b18c4ec-8082-454e-9c2a-a4b9e78b976c",
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
              offenceId: "8ef63fe9-485c-4b98-b69c-93804e11656a",
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
              offenceId: "6f701c82-9e6b-4010-998a-60a5ca4f9e00",
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
              offenceId: "85c42550-1374-4e36-ac08-b8360ee9e556",
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
              offenceId: "e6e65826-12cd-466b-9b89-924558406123",
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
              offenceId: "f90aec97-5a13-4353-b047-f979a6b42e11",
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
              offenceId: "daf6e25b-6b07-491f-9874-796edb491e59",
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
              offenceId: "3b48089a-e7d4-4ee6-8cf8-0c63fe2ce587",
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
              offenceId: "a4aa95e7-ad68-499e-a320-fa8cf2f1f541",
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
              offenceId: "6c37acad-9907-4426-bf1b-2922caace427",
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
              offenceId: "f71a27c4-dfb7-4cca-8737-240790bff561",
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
              offenceId: "9be781ab-64fa-4ec0-8ff4-e3fc8e870dba",
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
              offenceId: "d6ff456c-7685-452b-89c7-d977ab2aec7a",
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
              offenceId: "da1817d6-73dc-421f-b59d-57a5ccc347b1",
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
              offenceId: "eab5e6cf-3feb-4064-8914-e148c2440f51",
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
              offenceId: "76fb7063-df5b-45e4-b850-1a12797ab17d",
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
              offenceId: "2d1c9c2c-426b-4b3a-8975-80bc81091f14",
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
              offenceId: "4b0e3201-800b-4a40-8b04-8586999bc651",
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
              offenceId: "71d4ab03-5dee-4564-ab90-ce20519553dd",
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
              offenceId: "e20a049e-9030-402b-a9aa-819510e3618e",
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
              offenceId: "8e9ff5a1-bbee-4bfb-aa65-8c6f57a73f6f",
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
              offenceId: "4ba59136-bca0-4957-ae42-25baa1345ab8",
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
              offenceId: "2b2967da-d245-4756-82df-65633884e3ba",
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
              offenceId: "649744ab-ee66-45a2-8216-88c8be2c01c7",
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
              offenceId: "9c7fcf14-e9ec-43c3-9e64-464c3847d627",
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
              offenceId: "357cc324-e582-43d2-99fb-f388e3e8670b",
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
              offenceId: "4d2c9fb6-f7a4-414d-81b1-7025c7848283",
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
              offenceId: "28a5d516-53d7-45f4-970f-a10dfeebd384",
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
              offenceId: "8d7ef57a-9837-41f8-8cc6-f936d39d7247",
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
              offenceId: "675a7155-eee9-4acd-ab03-0f4d10b616ca",
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
              offenceId: "c736df86-1b1c-45b7-b446-5f3e35e0e727",
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
              offenceId: "87c6ed19-16f1-4da1-82fb-f880520b02d7",
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
              offenceId: "706ebb46-8c0c-4323-a312-fd566b5172ea",
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
              offenceId: "159807e9-ae11-4fce-950d-4da9a0e1a4ce",
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
              offenceId: "968f1581-dd82-4ecd-a200-9c250be3456d",
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
              offenceId: "b75466ef-8647-4018-8b11-b1acf558880f",
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
              offenceId: "218ca88f-725c-4a81-b2f5-fcd5f9d696d8",
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
              offenceId: "d0f3a1f7-1634-4918-a2ab-3a9ab87a7685",
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
              offenceId: "70daa424-3271-434e-bf29-a2cf7dbf3758",
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
              offenceId: "5d5a56d6-17f1-4230-9009-db9963cfed15",
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
              offenceId: "e285821d-768d-4fc0-91c6-f11568296e49",
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
              offenceId: "0b4b69dc-76f1-4c19-8e06-48d362ca2b0d",
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
              offenceId: "91b38382-6b1f-4bdf-bf9e-a6415e511cb1",
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
              offenceId: "ff2cefdc-3862-428a-8c30-57e9174ff4f6",
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
              offenceId: "8fb4bceb-8291-4e70-b2d3-57e44937bb01",
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
              offenceId: "dc9f1641-80e7-4e6f-8099-a8d2128caf59",
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
              offenceId: "0f777625-a2dc-4fe7-a322-84e8f80e2478",
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
              offenceId: "b5dbcb7a-5f9e-4282-944a-4e5e4bf04f98",
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
              offenceId: "afd3840a-6a86-4961-923f-24871bf6e136",
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
              offenceId: "9f0e6661-7bb2-4dd7-a14d-44fafec4b4a7",
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
              offenceId: "e98a6df9-7dee-4906-8f7d-1f9204ca4487",
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
              offenceId: "24ec9912-df84-4b3a-af8c-cd4b95212e7e",
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
              offenceId: "6b92cd9b-4ee7-4348-a720-03de8bf57072",
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
              offenceId: "9b2c75a8-c8c6-4a7e-a33d-e0a8e3ba4be9",
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
              offenceId: "b1be543b-3ed4-49c5-ad94-1c49766fa430",
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
              offenceId: "de2108cb-a101-40e9-9fb2-d0f3c7bd1f1f",
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
              offenceId: "4e67bffa-cb6b-4f4e-9c67-3f3e127cf8f8",
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
              offenceId: "4369907f-f796-4d57-a7b1-9c904e49ac45",
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
              offenceId: "268ee69e-d9a5-48fb-98f2-2cd6929183e0",
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
              offenceId: "8fc3d83d-82c5-4f58-96bb-d0dff786a3d9",
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
              offenceId: "f3436cfc-541c-4f1b-872a-0994d21461ca",
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
              offenceId: "a8d1045b-0a95-4cbb-b8cd-ba45d6c1bfdf",
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
              offenceId: "54da5f19-b149-40e7-9cd7-9b68ea32b07f",
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
              offenceId: "e876dc65-c97f-435a-b2ba-e6a057c38aad",
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
              offenceId: "481badfc-ed46-4d8b-b62c-3bd36fa552da",
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
              offenceId: "136ca4f0-37d0-49f9-964a-28481bca0b25",
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
              offenceId: "a61d84b3-01db-4450-bfbe-71089355fd6d",
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
              offenceId: "2aa6b190-9aba-4960-bd47-23466dc4e783",
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
