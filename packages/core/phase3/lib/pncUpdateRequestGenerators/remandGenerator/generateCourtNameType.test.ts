import generateCourtNameType from "./generateCourtNameType"

describe("generateCourtNameType", () => {
  describe("when 1st instance warrant is issued and remand court location is unknown", () => {
    it.each([{}])("", () => {})
  })

  it.each([
    {
      when: "court and remand location court codes are unknown (0000)",
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: ""
    },
    {
      when: "court code is failed to appear code (9998) and remand location court code is unknown (0000)",
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****FAILED TO APPEAR*****",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: "*****FAILED TO APPEAR*****"
    },
    {
      when: "court code is failed to appear (9998), remand location court code is unknown (0000), and court house name is 1st instance warrant issued",
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE WARRANT ISSUED*****",
      remandLocationCourt: "0000",
      expectedCourtNameType1: "",
      expectedCourtNameType2: "*****1ST INSTANCE WARRANT ISSUED*****"
    },
    {
      when: "both court and remand location court codes are failed to appear (9998)",
      courtCode: "9998",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    },
    {
      when: "court code is unknown (0000) and remand location court code is failed to appear (9998)",
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "Court house B",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "Court house B Court type A",
      expectedCourtNameType2: "Court house B Court type A"
    },
    {
      when: "court code is unknown (0000), remand location court code is failed to appear (9998), and court house name is 'FTA DATED WARRANT'",
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "***** FTA DATED WARRANT *****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "***** FTA DATED WARRANT *****",
      expectedCourtNameType2: ""
    },
    {
      when: "court code is unknown (0000), remand location court code is failed to appear (9998), and court house name is '1ST INSTANCE DATED WARRANT ISSUED'",
      courtCode: "0000",
      courtType: "Court type A",
      courtHouseName: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      remandLocationCourt: "9998",
      expectedCourtNameType1: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
      expectedCourtNameType2: ""
    },
    {
      when: "",
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
    "should return correct court names when $when",
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
