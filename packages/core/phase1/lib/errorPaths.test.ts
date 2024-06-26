import errorPaths from "./errorPaths"

describe("errorPath", () => {
  test("case paths should match the snapshot", () => {
    const casePaths = errorPaths.case

    expect({ casePaths }).toMatchSnapshot()
  })

  test("offence and result should match the snapshot when offence index is 0", () => {
    const offence = errorPaths.offence(0)
    const result = offence.result(0)
    const resultQualifierVariableCode = result.resultQualifierVariable(2)
    const amountSpecifiedInResult = result.amountSpecifiedInResult(3)

    expect({ offence, result, resultQualifierVariableCode, amountSpecifiedInResult }).toMatchSnapshot()
  })
})
