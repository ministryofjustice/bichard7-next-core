import addPaddingToBailCondition from "./addPaddingToBailCondition"

describe("addPaddingToBailCondition", () => {
  it("doesn't add padding when less than 50 characters long", () => {
    const bailCondition = "1111 2222 3333 4444 5555 6666 7777 8888 9999 0000"

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([bailCondition])
  })

  it("doesn't add padding when 50 characters long", () => {
    const bailCondition = "1111 2222 3333 4444 5555 6666 7777 8888 9999 00000"

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([bailCondition])
  })

  it("adds padding when 51 characters long", () => {
    const bailCondition = "1111 2222 3333 4444 5555 6666 7777 8888 9999 00000."

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual(["1111 2222 3333 4444 5555 6666 7777 8888 9999      00000."])
  })

  it("removes spacing between lines", () => {
    const lineOneWithoutSpacing = "1111 2222 3333 4444 5555 6666 7777 8888 9999 00000"
    const lineTwoWithSpacingAtBeginning = " 1111 2222 3333 4444 5555 6666 7777 8888 9999 0000"
    const bailCondition = lineOneWithoutSpacing + lineTwoWithSpacingAtBeginning

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([
      "1111 2222 3333 4444 5555 6666 7777 8888 9999 00000" + "1111 2222 3333 4444 5555 6666 7777 8888 9999 0000"
    ])
  })

  it("preserves space when one space between lines", () => {
    const lineOneWithSpacingAtEnd = "1111 2222 3333 4444 5555 6666 7777 8888 9999 0000 "
    const lineTwoWithoutSpacing = "1111 2222 3333 4444 5555 6666 7777 8888 9999 0000"
    const bailCondition = lineOneWithSpacingAtEnd + lineTwoWithoutSpacing

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([bailCondition])
  })

  it("adds padding when line is more than 50 characters long", () => {
    const bailCondition =
      "1111 2222 3333 4444 5555 6666 7777 8888 9999 111111 2222 3333 4444 5555 6666 7777 8888 9999 00 1111"

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([
      "1111 2222 3333 4444 5555 6666 7777 8888 9999      " +
        "111111 2222 3333 4444 5555 6666 7777 8888 9999 00 " +
        "1111"
    ])
  })

  it("adds padding when line contains newlines", () => {
    const bailCondition =
      "1111 2222 3333 4444\n5555 6666 7777 8888 999999\n" +
      "1111 2222 3333 4444 5555 6666 7777 8888 999999\n" +
      "1111 2222 3333 4444 5555 6666 7777 8888 999999\n" +
      "1111 2222 3333 4444 5555 6666 7777 8888 9999 000000"

    const paddedBailCondition = addPaddingToBailCondition(bailCondition)

    expect(paddedBailCondition).toStrictEqual([
      "1111 2222 3333 4444                               " +
        "5555 6666 7777 8888 999999                        " +
        "1111 2222 3333 4444 5555 6666 7777 8888 999999    " +
        "1111 2222 3333 4444 5555 6666 7777 8888 999999    ",
      "1111 2222 3333 4444 5555 6666 7777 8888 9999      " + "000000"
    ])
  })
})
