import { isError } from "@moj-bichard7/common/types/Result"

import type PollAction from "./PollAction"

import Poller from "./Poller"
import PollOptions from "./PollOptions"

const expectedResult = "Hello, World!"

const poll = (
  options: PollOptions<string | undefined>,
  numberOfIterations: number,
  shouldSucceed: boolean
): Promise<string | undefined> => {
  let iterations = 0

  const action: PollAction<string | undefined> = () =>
    new Promise((resolve) => {
      if (shouldSucceed && iterations === numberOfIterations) {
        resolve(expectedResult)
      } else {
        iterations++
        resolve(undefined)
      }
    })

  const poller = new Poller<string | undefined>(action)
  return poller.poll(options)
}

describe("Poller", () => {
  it("should succeed when the item is found", async () => {
    const options = new PollOptions(5000)
    const message = await poll(options, 1, true)

    expect(message).toBe("Hello, World!")
  })

  it("should take 3 seconds to find the item", async () => {
    const options = new PollOptions(5000)
    const message = await poll(options, 3, true)

    expect(message).toBe("Hello, World!")
  })

  it("should fail when the timeout is exceeded", async () => {
    let actualError: Error | undefined

    try {
      const options = new PollOptions(1000)
      await poll(options, 1, false)
    } catch (error) {
      actualError = isError(error) ? error : Error("Failed polling")
    }

    expect(actualError).toBeDefined()
    expect(actualError?.message).toBe("Failed polling due to exceeding the timeout")
  })

  it("should succeed when condition is valid", async () => {
    const options = new PollOptions(5000)
    options.condition = (result) => result === expectedResult
    const message = await poll(options, 1, true)

    expect(message).toBe("Hello, World!")
  })

  it("should fail when condition is invalid", async () => {
    let actualError: Error | undefined

    try {
      const options = new PollOptions(1000)
      options.condition = (result) => result === expectedResult
      await poll(options, 1, false)
    } catch (error) {
      actualError = isError(error) ? error : Error("Failed polling")
    }

    expect(actualError).toBeDefined()
    expect(actualError?.message).toBe("Failed polling due to exceeding the timeout")
  })
})
