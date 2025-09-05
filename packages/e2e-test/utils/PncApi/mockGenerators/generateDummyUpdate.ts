import type { PartialPncMock } from "../../../types/PncMock"

const generateDummyUpdate = (): PartialPncMock => {
  return {
    matchRegex: "CXU",
    response: '<?XML VERSION="1.0" STANDALONE="YES"?><DUMMY></DUMMY>',
    expectedRequest: ""
  }
}

export default generateDummyUpdate
