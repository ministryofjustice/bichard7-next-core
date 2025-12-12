import type { AsnQueryResponse } from "../../../../types/leds/AsnQueryResponse"

import ledsAsnQueryResponse from "../../../../tests/fixtures/leds-asn-query-response-001.json"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"

describe("mapToPoliceQueryResult", () => {
  it("should map LEDS ASN query response to police query result", () => {
    const policeQueryResult = mapToPoliceQueryResult(ledsAsnQueryResponse as AsnQueryResponse, "dummy checkname")

    expect(policeQueryResult).toMatchSnapshot()
  })
})
