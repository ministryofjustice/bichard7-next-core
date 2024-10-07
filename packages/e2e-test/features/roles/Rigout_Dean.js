module.exports = [
  {
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXE01>
      <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
      <ASI>
        <FSC>K04CA</FSC>
        <IDS>K00/459646G MIDDLETONN              </IDS>
        <CCR>K97/1626/8395Q                 </CCR>
        <COF>K001    12:15:24:1   TH68006 281120102220            </COF>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
