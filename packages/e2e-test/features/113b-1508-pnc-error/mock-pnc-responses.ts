import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02",
    response: {
      gmh: "073RDIS000006EERRARRPNCA05A73000017300000120231121104673000001                                             090018337",
      gmt: "000003073RDIS000006E",
      status: 400,
      title: "string",
      type: "conflict/version",
      details: "string",
      instance: "string",
      leds: {
        errors: [
          {
            errorDetailType:
              "I0001 - THE FOLLOWING ELEMENT(S) IN THE DIS SEGMENT CONTAIN INVALID DATA: DISPOSAL TYPE , DISPOSAL QUANTITY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ",
            message:
              "I0001 - THE FOLLOWING ELEMENT(S) IN THE DIS SEGMENT CONTAIN INVALID DATA: DISPOSAL TYPE , DISPOSAL QUANTITY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 "
          }
        ]
      }
    }
  })
]
