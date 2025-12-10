/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Declares the new custom matcher on Jest's Matchers interface
 * so TypeScript recognizes expect(value).toMatchJson(other).
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchJson(expected: unknown): R
    }
  }
}

const toMatchJson = function (
  this: jest.MatcherContext,
  received: unknown,
  expected: unknown
): jest.CustomMatcherResult {
  const receivedJson = JSON.parse(JSON.stringify(received))
  const expectedJson = JSON.parse(JSON.stringify(expected))
  const pass = this.equals(receivedJson, expectedJson)

  const message = () => {
    const diffString = this.utils.diff(expectedJson, receivedJson, {
      expand: this.expand
    })

    return (
      (pass ? "Expected not to equal JSON:" : "Expected to equal JSON:") +
      `\n  ${this.utils.printExpected(expected)}\n` +
      "Received:\n" +
      `  ${this.utils.printReceived(received)}\n\n` +
      (diffString ? `Difference:\n\n${diffString}` : "")
    )
  }

  return { pass, message }
}

expect.extend({
  toMatchJson
})

export {}
