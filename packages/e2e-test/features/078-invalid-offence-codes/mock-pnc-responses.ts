export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR010172EERRASIPNCA05A73000017300000120231120142173000001                                             050018288</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </TXT>
      <GMT>000003073ENQR010172E</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
