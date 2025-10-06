import generateRequestHeaders from "./generateRequestHeaders"

describe("generateRequestHeaders", () => {
  it("should generate the request headers", () => {
    const headers = generateRequestHeaders("dummy-id")

    expect(headers).toEqual({
      Accept: "application/json",
      "X-Leds-Action-Code": "",
      "X-Leds-Activity-Code": "",
      "X-Leds-Activity-Flow-Id": "",
      "X-Leds-Application-Datetime": "",
      "X-Leds-Correlation-Id": "dummy-id",
      "X-Leds-Justification": "",
      "X-Leds-Reason": "",
      "X-Leds-Session-Id": "",
      "X-Leds-System-Name": ""
    })
  })
})
