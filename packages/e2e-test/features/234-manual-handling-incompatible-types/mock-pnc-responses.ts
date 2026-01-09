import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
  <CXE01>
    <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
    <ASI>
      <FSC>K01AB</FSC>
      <IDS>K09/494Y    NOLAN                   </IDS>
      <PCR>K01AD/99991T        </PCR>
      <COF>K001    5:5:8:1      TH68010 06072008                </COF>
      <DIS>I1109000C 100.00                                                                                         </DIS>
    </ASI>
    <GMT>000008073ENQR004540S</GMT>
  </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.generateDummyUpdate()
]
