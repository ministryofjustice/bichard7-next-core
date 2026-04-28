export const clearPncMocks = () =>
  fetch("http://localhost:3000/mocks", {
    method: "DELETE"
  })
