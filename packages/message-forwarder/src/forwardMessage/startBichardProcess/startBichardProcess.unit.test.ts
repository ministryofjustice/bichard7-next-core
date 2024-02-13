import "../../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "mq"

import * as putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { randomUUID } from "crypto"
import ignoredAHOFixture from "../../test/fixtures/ignored-aho.json"
import { startBichardProcess } from "./startBichardProcess"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const conductorClient = createConductorClient()

describe("forwardMessage", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("throws an exception if it can't write to S3", async () => {
    jest.spyOn(putFileToS3, "default").mockReturnValue(Promise.resolve(new Error("Mock error")))

    const result = await startBichardProcess(
      "bichard_phase_1",
      ignoredAHOFixture as unknown as AnnotatedHearingOutcome,
      randomUUID(),
      conductorClient
    ).catch((e) => e as Error)

    expect(result).toHaveProperty("message", "Mock error")
  })
})
