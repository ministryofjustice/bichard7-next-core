import disqualifiedFromKeepingDisposalText from "./disqualifiedFromKeepingDisposalText"

describe("check disqualifiedFromKeepingDisposalText", () => {
  it("Given result text containing a disqualification for life, returns the subject of the disqualification", () => {
    const resultVariableText = "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR LIFE"
    const result = disqualifiedFromKeepingDisposalText(resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })

  it("Given result text containing a disqualification for life with additional information, returns the subject of the disqualification", () => {
    const resultVariableText =
      "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR LIFE BECAUSE TRIED TO PUT THEM IN POCKET"
    const result = disqualifiedFromKeepingDisposalText(resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })

  it("Given result text containing a disqualification for a specific period, returns the subject of the disqualification", () => {
    const resultVariableText = "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR A PERIOD OF"
    const result = disqualifiedFromKeepingDisposalText(resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })

  it("Given result text containing a disqualification for a sepecific period with additional information, returns the subject of the disqualification", () => {
    const resultVariableText =
      "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR A PERIOD OF TEN YEARS BECAUSE TRIED TO PUT THEM IN POCKET"
    const result = disqualifiedFromKeepingDisposalText(resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })

  it("Given result text without disqualification text, returns an empty string", () => {
    const resultVariableText = "MINIATURE SHETLAND PONIES ARE VERY SMALL"
    const result = disqualifiedFromKeepingDisposalText(resultVariableText)

    expect(result).toBe("")
  })
})
