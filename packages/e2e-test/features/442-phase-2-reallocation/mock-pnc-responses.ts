import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02",
    response: {
      gmh: "073ENQR010175EERRASIPNCA05A73000017300000120231120162473000001                                             050018291",
      gmt: "000003073ENQR010175E",
      status: 400,
      title: "string",
      type: "conflict/version",
      details: "string",
      instance: "string",
      leds: {
        errors: [
          {
            errorDetailType:
              "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ",
            message:
              "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "
          }
        ]
      }
    },
    count: 1
  })
]
