import generateCourtNameType from "./generateCourtNameType"

describe("generateCourtNameType", () => {
  it.each([
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      type: 1,
      expected: ""
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****FAILED TO APPEAR*****",
      remandLocationCourt: "0000",
      type: 1,
      expected: ""
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE WARRANT ISSUED*****",
      remandLocationCourt: "0000",
      type: 1,
      expected: ""
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      type: 1,
      expected: "Court house B Court type A"
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      type: 1,
      expected: "Court house B Court type A"
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "***** FTA DATED WARRANT *****",
      remandLocationCourt: "9998",
      type: 1,
      expected: "***** FTA DATED WARRANT *****"
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      type: 1,
      expected: "*****1ST INSTANCE DATED WARRANT ISSUED*****"
    },

    // Type 2

    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      type: 2,
      expected: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "***** FTA DATED WARRANT *****",
      remandLocationCourt: "9998",
      type: 2,
      expected: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      type: 2,
      expected: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      type: 2,
      expected: "Court house B Court type A"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****FAILED TO APPEAR*****",
      remandLocationCourt: "9998",
      type: 2,
      expected: "*****FAILED TO APPEAR*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      type: 2,
      expected: "*****1ST INSTANCE WARRANT ISSUED*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      type: 2,
      expected: "Court house B Court type A"
    }
  ])(
    "should return '$expected' for $courtCode, $courtType, $courtHouseName, $remandLocationCourt, $type",
    ({ courtCode, courtType, courtHouseName, remandLocationCourt, type, expected }) => {
      const result = generateCourtNameType(courtCode, courtType, courtHouseName, remandLocationCourt, type as 1 | 2)

      expect(result).toBe(expected)
    }
  )
})
