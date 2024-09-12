export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR010176EERRASIPNCA05A73000017300000120231120162773000001                                             050018292</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410843C) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </TXT>
      <GMT>000003073ENQR010176E</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
