import updateQueryString from "utils/updateQueryString"

describe("updateQueryString", () => {
  it("Should add, update, and delete query string parameters", () => {
    const historyItems: string[] = []

    global.window = {
      location: new URL("https://localhost:4080/bichard?key1=value1&key2=value2#OtherValue") as unknown as Location
    } as unknown as Window & typeof globalThis

    global.history = {
      pushState: (_, __, url) => {
        historyItems.push(String(url))
      }
    } as History

    updateQueryString({
      key1: "value10",
      key2: null,
      key3: "value3"
    })

    expect(historyItems).toStrictEqual(["/bichard?key1=value10&key3=value3"])
  })
})
