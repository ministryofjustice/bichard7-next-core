export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR010180EERRASIPNCA05A73000017300000120231120164873000001                                             050018296</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (08/01VK/01/377366T) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </TXT>
      <GMT>000003073ENQR010180E</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
