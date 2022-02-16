import findResultCode from "./findResultCode"

it("should return the result code when it exists", () => {
  const result = findResultCode(3501)

  expect(result).toBeDefined()
})

it("should throw error when result code does not exist", () => {
  const code = 99999
  const getResult = () => findResultCode(code)

  expect(getResult).toThrow(`Result code ${code} not found`)
})
