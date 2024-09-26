import isAmountSpecifiedInResultValid from "./isAmountSpecifiedInResultValid"

describe("isAmountSpecifiedInResultValid", () => {
  it("should return true when amount is less than 11 characters and integral part is less than 8 characters", () => {
    const result = isAmountSpecifiedInResultValid(1234567.89)

    expect(result).toBe(true)
  })

  it("should return false when amount is undefined", () => {
    const amountResult = isAmountSpecifiedInResultValid(undefined)

    expect(amountResult).toBe(false)
  })

  it.each([
    {
      when: "integral part length is 8 characters and total length is 10 characters",
      amount: 12345678.9
    },
    { when: "integral part length is 8 characters without decimal part", amount: 12345678 },
    { when: "integral part length is 7 characters but total length is 11 characters", amount: 1234567.891 },
    // prettier-ignore
    { when: "integral part is missing and total length is 10 characters", amount: .123456789 },
    { when: "integral part length is 1 character and total length is 10 characters", amount: 0.123456789 }
  ])("should return false when amount $when", ({ amount }) => {
    const amountResult = isAmountSpecifiedInResultValid(amount)

    expect(amountResult).toBe(false)
  })
})
