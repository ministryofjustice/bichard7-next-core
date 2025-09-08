import type { PartialPncMock } from "../../../types/PncMock"

export const generateDummyUpdate = (): PartialPncMock => {
  return {
    matchRegex: "CXU",
    response: '<?XML VERSION="1.0" STANDALONE="YES"?><DUMMY></DUMMY>',
    expectedRequest: ""
  }
}
