import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      gmh: "073ENQR010180EERRASIPNCA05A73000017300000120231120164873000001                                             050018296",
      txt: "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (08/01VK/01/377260C) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ",
      gmt: "000003073ENQR010180E"
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  })
]
