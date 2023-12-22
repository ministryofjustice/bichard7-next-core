import axios from "axios"

export const uploadPncMock = async (fixture: object | string) => {
  await axios.post("http://localhost:3000/mocks", fixture)
}
