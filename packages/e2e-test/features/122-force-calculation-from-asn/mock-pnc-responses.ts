import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      gmh: "073ENQR010250EERRASIPNCA05A73000017300000120231121151573000001                                             050018370",
      txt: "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01BH/00/376275M) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ",
      gmt: "000003073ENQR010250E"
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  })
]
