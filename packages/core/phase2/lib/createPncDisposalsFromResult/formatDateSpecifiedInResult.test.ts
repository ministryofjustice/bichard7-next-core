import formatDateSpecifiedInResult from "./formatDateSpecifiedInResult"

describe("formatDateSpecifiedInResult", () => {
  it("returns a string in dd/mmy/yyy format", () => {
    const formattedDate = formatDateSpecifiedInResult(new Date("2024-05-10"))

    expect(formattedDate).toBe("10/05/2024")
  })

  it("returns a string in ddmmyyyy format when removing slashes", () => {
    const removeSlashes = true

    const formattedDate = formatDateSpecifiedInResult(new Date("2024-05-10"), removeSlashes)

    expect(formattedDate).toBe("10052024")
  })
})
