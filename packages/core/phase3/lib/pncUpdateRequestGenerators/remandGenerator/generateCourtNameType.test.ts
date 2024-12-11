import generateCourtNameType from "./generateCourtNameType"

describe("generateCourtNameType", () => {
  it.each([
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****FAILED TO APPEAR*****",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: "*****FAILED TO APPEAR*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE WARRANT ISSUED*****",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: "*****1ST INSTANCE WARRANT ISSUED*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "***** FTA DATED WARRANT *****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "***** FTA DATED WARRANT *****",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "***** FTA DATED WARRANT *****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "***** FTA DATED WARRANT *****",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      expectedCourtNameType2: ""
    },
    {
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****FAILED TO APPEAR*****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "*****FAILED TO APPEAR***** Court type A",
      expectedCourtNameType2: "*****FAILED TO APPEAR*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "*****1ST INSTANCE WARRANT ISSUED***** Court type A",
      expectedCourtNameType2: "*****1ST INSTANCE WARRANT ISSUED*****"
    },
    {
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    }
  ])(
    "should return '$expectedCourtNameType1' and '$expectedCourtNameType2' for $courtCode, $courtType, $courtHouseName, $remandLocationCourt",
    ({ courtCode, courtType, courtHouseName, remandLocationCourt, expectedCourtNameType1, expectedCourtNameType2 }) => {
      const [courtNameType1, courtNameType2] = generateCourtNameType(
        courtCode,
        courtType,
        courtHouseName,
        remandLocationCourt
      )

      expect(courtNameType1).toBe(expectedCourtNameType1)
      expect(courtNameType2).toBe(expectedCourtNameType2)
    }
  )
})
