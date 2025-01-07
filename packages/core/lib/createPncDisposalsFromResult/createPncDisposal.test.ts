import createPncDisposal from "./createPncDisposal"

describe("createPncDisposal", () => {
  it("creates a PNC disposal", () => {
    const pncDisposal = createPncDisposal({
      amountSpecifiedInResult: 12000.99,
      dateSpecifiedInResult: new Date("2024-05-10"),
      disposalText: "disposal-text",
      durationLength: 123,
      durationUnit: "D",
      pncDisposalType: 2060,
      resultQualifiers: ["B", "C", "D", "E"],
      secondaryDurationLength: 5,
      secondaryDurationUnit: "A"
    })

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
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 9999999.99,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 123,
        durationUnit: "d",
        pncDisposalType: 1
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("d123100520249999999.9900")
    })

    it("pads values to correct length", () => {
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 9.99,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 1,
        durationUnit: "d",
        pncDisposalType: 1
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("d1  100520240000009.9900")
    })

    it("adds padding for missing values", () => {
      const { qtyUnitsFined } = createPncDisposal({})

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("                      00")
    })

    it("uses PNC representation of life sentence", () => {
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 0,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 1,
        durationUnit: "L",
        pncDisposalType: 1
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("Y99910052024          00")
    })

    it("leaves disposalQuantity blank if unit is session", () => {
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 0,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 1,
        durationUnit: "S",
        pncDisposalType: 1
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("    10052024          00")
    })

    it("leaves disposalQuantity blank if unit is empty string", () => {
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 0,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 1,
        durationUnit: "",
        pncDisposalType: 1
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("    10052024          00")
    })

    it("leaves date blank if disposal type is on no disposal date list", () => {
      const { qtyUnitsFined } = createPncDisposal({
        amountSpecifiedInResult: 0,
        dateSpecifiedInResult: new Date("2024-05-10"),
        durationLength: 123,
        durationUnit: "D",
        pncDisposalType: 2059
      })

      expect(qtyUnitsFined).toHaveLength(24)
      expect(qtyUnitsFined).toBe("D123                  00")
    })
  })

  describe("qualifiers", () => {
    it("returns a string in qqQQqqQQDDDD format", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["C", "E", "C", "F"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("C E C F A123")
    })

    it("returns an empty string when no qualifiers", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: []
      })

      expect(qualifiers).toBe("")
    })

    it("returns an empty string when only qualifier is not in allowed list", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["CV"]
      })

      expect(qualifiers).toBe("")
    })

    it("omits qualifiers not in allowed list and appends S", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["B", "B", "B", "B"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("S       A123")
    })

    it("uses PNC representation of life sentence", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["C", "C", "C", "C"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "L"
      })

      expect(qualifiers).toHaveLength(12)
      expect(qualifiers).toBe("C C C C Y999")
    })

    it("adds S qualifiers to the end", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["S", "C", "C", "C"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toBe("C C C S A123")
    })

    it("removes trailing whitespace when a single qualifier", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["F"],
        secondaryDurationLength: undefined,
        secondaryDurationUnit: undefined
      })

      expect(qualifiers).toBe("F ")
    })

    it("adds S qualifier when there's a secondary duration and qualifier is less than or equal to 6", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["C", "C", "C"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toBe("C C C S A123")
    })

    it("adds padding for when fewer than three qualifiers", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["C"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toBe("C S     A123")
    })

    it("doesn't add padding for when multiple double character qualifiers", () => {
      const { qualifiers } = createPncDisposal({
        pncDisposalType: 1234,
        resultQualifiers: ["YW", "YV", "YU"],
        secondaryDurationLength: 123,
        secondaryDurationUnit: "A"
      })

      expect(qualifiers).toBe("YWYVYUS A123")
    })
  })
})
