import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXU02>
      <GMH>073RDIS000006EERRARRPNCA05A73000017300000120231121104673000001                                             090018337</GMH>
      <TXT>I0001 - THE FOLLOWING ELEMENT(S) IN THE DIS SEGMENT CONTAIN INVALID DATA: DISPOSAL TYPE , DISPOSAL QUANTITY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 </TXT>
      <GMT>000003073RDIS000006E</GMT>
    </CXU02>`,
    expectedRequest: ""
  })
]
