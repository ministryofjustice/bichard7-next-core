export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR010175EERRASIPNCA05A73000017300000120231120162473000001                                             050018291</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </TXT>
      <GMT>000003073ENQR010175E</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
