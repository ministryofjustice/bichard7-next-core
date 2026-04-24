export const uploadPncMock = async (fixture: object | string) => {
  await fetch("http://localhost:3000/mocks", {
    body: JSON.stringify(fixture),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })
}
