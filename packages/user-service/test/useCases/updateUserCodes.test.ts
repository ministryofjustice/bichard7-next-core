import QueryString from "qs"
import updateUserCodes from "useCases/updateUserCodes"

const typeOfCodes = "prefix"

it("should return new codes if old codes are empty", () => {
  const singleCode = { id: "001", name: "London Met" }
  const formData: QueryString.ParsedQs = {}
  formData.prefix001 = "true"

  const result = updateUserCodes([singleCode], typeOfCodes, formData)
  expect(result).toBe("001")
})

it("should append extra codes if they need to be added", () => {
  const firstCode = { id: "000", name: "London Met" }
  const secondCode = { id: "001", name: "London Met2" }
  const formData = { prefix000: "true", prefix001: "true" }

  const result = updateUserCodes([firstCode, secondCode], typeOfCodes, formData)
  expect(result).toBe("000,001")
})

it("should leave codes empty if formdata empty", () => {
  const singleCode = { id: "001", name: "London Met" }
  const formData: QueryString.ParsedQs = {}

  const result = updateUserCodes([singleCode], typeOfCodes, formData)
  expect(result).toBe("")
})

it("should leave codes empty if no matching data", () => {
  const singleCode = { id: "001", name: "London Met" }
  const formData: QueryString.ParsedQs = {}
  formData.prefix002 = "true"

  const result = updateUserCodes([singleCode], typeOfCodes, formData)
  expect(result).toBe("")
})

it("should append extra codes if they need to be added", () => {
  const firstCode = { id: "000", name: "London Met" }
  const secondCode = { id: "001", name: "London Met2" }
  const formData = { prefix000: "true", prefix001: "true" }

  const result = updateUserCodes([firstCode, secondCode], typeOfCodes, formData, false)
  expect(result).toBe("")
})

it("should append extra codes if they need to be added", () => {
  const firstCode = { id: "000", name: "London Met" }
  const secondCode = { id: "001", name: "London Met2" }
  const formData = { prefix000: "true" }

  const result = updateUserCodes([firstCode, secondCode], typeOfCodes, formData, false)
  expect(result).toBe("001")
})
