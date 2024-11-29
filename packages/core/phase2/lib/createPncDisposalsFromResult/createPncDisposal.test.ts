import createPncDisposal from "./createPncDisposal"

describe("createPncDisposal", () => {
  it("creates a PNC disposal", () => {
    const pncDisposalType = 2060
    const durationUnit = "D"
    const durationLength = 123
    const secondaryDurationUnit = "A"
    const secondaryDurationLength = 5
    const dateSpecifiedInResult = new Date("2024-05-10")
    const amountSpecifiedInResult = 12000.99
    const resultQualifiers = ["B", "C", "D", "E"]
    const disposalText = "disposal-text"

    const pncDisposal = createPncDisposal(
      pncDisposalType,
      durationUnit,
      durationLength,
      secondaryDurationUnit,
      secondaryDurationLength,
      dateSpecifiedInResult,
      amountSpecifiedInResult,
      resultQualifiers,
      disposalText
    )

    expect(pncDisposal).toEqual({
      qtyDate: "10052024",
      qtyDuration: "D123",
      qtyMonetaryValue: "12000.99",
      qtyUnitsFined: "D123100520240012000.9900",
      qualifiers: "C E S   A5",
      text: "disposal-text",
      type: 2060
    })
  })

  describe("qtyUnitsFined", () => {
    it("returns a string in dnnnDDMMYYYYNNNNNNN.NNUU format", () => {
      const pncDisposalType = 1
      const durationUnit = "d"
      const durationLength = 123
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 9999999.99

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("d123100520249999999.9900")
    })

    it("pads values to correct length", () => {
      const pncDisposalType = 1
      const durationUnit = "d"
      const durationLength = 1
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 9.99

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("d1  100520240000009.9900")
    })

    it("adds padding for missing values", () => {
      const { qtyUnitsFined } = createPncDisposal(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("                      00")
    })

    it("uses PNC representation of life sentence", () => {
      const pncDisposalType = 1
      const durationUnit = "L"
      const durationLength = 1
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 0

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("Y99910052024          00")
    })

    it("leaves disposalQuantity blank if unit is session", () => {
      const pncDisposalType = 1
      const durationUnit = "S"
      const durationLength = 1
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 0

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("    10052024          00")
    })

    it("leaves disposalQuantity blank if unit is empty string", () => {
      const pncDisposalType = 1
      const durationUnit = ""
      const durationLength = 1
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 0

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("    10052024          00")
    })

    it("leaves date blank if disposal type is on no disposal date list", () => {
      const pncDisposalType = 2059
      const durationUnit = "D"
      const durationLength = 123
      const dateSpecifiedInResult = new Date("2024-05-10")
      const amountSpecifiedInResult = 0

      const { qtyUnitsFined } = createPncDisposal(
        pncDisposalType,
        durationUnit,
        durationLength,
        undefined,
        undefined,
        dateSpecifiedInResult,
        amountSpecifiedInResult,
        undefined,
        undefined
      )

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("D123                  00")
    })
  })

  describe("qualifiers", () => {
    it("returns a string in qqQQqqQQDDDD format", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["C", "E", "C", "F"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("C E C F A123")
    })

    it("omits qualifiers not in allowed list and appends S", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["B", "B", "B", "B"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("S       A123")
    })

    it("uses PNC representation of life sentence", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "L"
      const secondaryDurationLength = 123
      const resultQualifiers = ["C", "C", "C", "C"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("C C C C Y999")
    })

    it("adds S qualifiers to the end", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["S", "C", "C", "C"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toBe("C C C S A123")
    })

    it("removes trailing whitespace when a single qualifier", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = undefined
      const secondaryDurationLength = undefined
      const resultQualifiers = ["F"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toBe("F ")
    })

    it("adds S qualifier when there's a secondary duration and qualifier is less than or equal to 6", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["C", "C", "C"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toBe("C C C S A123")
    })

    it("adds padding for when fewer than three qualifiers", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["C"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toBe("C S     A123")
    })

    it("doesn't add padding for when multiple double character qualifiers", () => {
      const pncDisposalType = 1234
      const secondaryDurationUnit = "A"
      const secondaryDurationLength = 123
      const resultQualifiers = ["YW", "YV", "YU"]

      const { qualifiers } = createPncDisposal(
        pncDisposalType,
        undefined,
        undefined,
        secondaryDurationUnit,
        secondaryDurationLength,
        undefined,
        undefined,
        resultQualifiers,
        undefined
      )

      expect(qualifiers).toBe("YWYVYUS A123")
    })
  })
})
