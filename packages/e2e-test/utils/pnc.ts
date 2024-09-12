import { expect } from "expect"
import fs from "fs"
import path from "path"
import Poller from "./Poller"
import { isError } from "./isError"
import { extractAllTags, updateExpectedRequest } from "./tagProcessing"
import type Bichard from "./world"

const skipPNCValidation = process.env.SKIP_PNC_VALIDATION === "true"

export type PncMock = {
  id: string
  matchRegex: string
  response: string
  count: number
  requests: string[]
  expectedRequest: string
}

const setupMockInPncEmulator = async function (this: Bichard, specFolder: string) {
  // mock a response in the PNC
  const mocks = await import(`../${specFolder}/mock-pnc-responses`)
  this.mocks = mocks.default(`${specFolder}/pnc-data.xml`, this) as PncMock[]

  for (const mock of this.mocks) {
    if (this.config.parallel) {
      const asnID = this.currentProsecutorReference[0][1].substring(this.currentProsecutorReference[0][1].length - 7)
      mock.matchRegex = `${mock.matchRegex}.+${asnID}`
    }

    const mockId = await this.pnc.addMock(mock.matchRegex, mock.response, mock.count)
    if (!mockId) {
      throw new Error("Failed to create mock PNC request")
    }

    mock.id = mockId
  }
}

export const mockMissingPncDataForTest = async function (this: Bichard) {
  if (!this.config.realPNC) {
    const specFolder = path.dirname(this.featureUri)
    await setupMockInPncEmulator.call(this, specFolder)
  }
}

/* eslint-disable consistent-return */
export const mockPNCDataForTest = async function (this: Bichard) {
  const specFolder = path.dirname(this.featureUri)
  if (this.config.realPNC) {
    let xmlData
    const ncmFile = `${specFolder}/pnc-data.xml`
    const messageFile = `${specFolder}/input-message.xml`
    if (fs.existsSync(ncmFile)) {
      xmlData = fs.readFileSync(ncmFile, "utf8").toString()
    } else if (fs.existsSync(messageFile)) {
      xmlData = fs.readFileSync(messageFile, "utf8").toString()
    } else {
      const messageFiles = fs.readdirSync(specFolder).filter((f) => f.match(/input-message-\d\.xml/))
      if (messageFiles.length === 0) {
        throw new Error("No input message files found")
      }

      xmlData = fs.readFileSync(`${specFolder}/${messageFiles[0]}`, "utf8").toString()
    }

    extractAllTags(this, xmlData)
    if (skipPNCValidation) {
      return
    }

    try {
      await this.pnc.setupRecord(specFolder)
    } catch (err) {
      if (!(err instanceof Error)) {
        throw new Error("Problem handling error from PNC Emulator")
      }

      if (err.message === "PNC record does not match expected before state") {
        return "pending"
      }

      console.error(err.message)
      throw err
    }
  } else {
    await setupMockInPncEmulator.call(this, specFolder)
  }
}

export const createValidRecordInPNC = async function (this: Bichard, record: string) {
  if (this.config.realPNC) {
    return
  }

  this.recordId = record

  const specFolder = path.dirname(this.featureUri)
  this.mocks = require(`../${specFolder}/${record.replace(/[ ]+/g, "_")}`)

  const mockPromises = this.mocks.map((mock) => this.pnc.addMock(mock.matchRegex, mock.response))
  const mockIds = await Promise.all(mockPromises)
  for (let i = 0; i < this.mocks.length; i += 1) {
    const mockId = mockIds[i]
    if (!mockId) {
      throw new Error("Failed to set up mock PNC request")
    }

    this.mocks[i].id = mockId
  }
}

const fetchMocks = async (world: Bichard) => {
  const mockResponsePromises = world.mocks.map(({ id }) => world.pnc.awaitMockRequest(id))
  const mockResponses = await Promise.all(mockResponsePromises)
  for (let i = 0; i < world.mocks.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    world.mocks[i].requests = mockResponses[i].requests || []
  }
}

export const checkMocks = async function (this: Bichard) {
  if (this.config.realPNC) {
    if (skipPNCValidation) {
      return
    }

    const specFolder = path.dirname(this.featureUri)
    const action = (): Promise<boolean> => this.pnc.checkRecord(specFolder)

    const condition = (result: boolean) => {
      if (result) {
        const before = fs.readFileSync(`${specFolder}/pnc-data.before.xml`).toString().trim()
        const after = fs.readFileSync(`${specFolder}/pnc-data.after.xml`).toString().trim()
        if (before === after) {
          return false
        }
      }

      return result
    }

    const options = {
      condition,
      timeout: 10000,
      delay: 250,
      name: "Mock PNC request poller"
    }
    const result = await new Poller<boolean>(action)
      .poll(options)
      .then((res) => res)
      .catch((error) => error)
    expect(isError(result)).toBeFalsy()
    expect(result).toBeTruthy()
  } else {
    await fetchMocks(this)
    expect(this.mocks.length).toBeGreaterThan(0)
    let mockCount = 0
    this.mocks.forEach((mock) => {
      if (mock.expectedRequest !== "") {
        if (mock.requests.length === 0) {
          throw new Error(`Mock not called for ${mock.matchRegex}`)
        }

        if (this.config.parallel) {
          expect(mock.requests.length).toBeGreaterThanOrEqual(1)
          const expectedRequest = updateExpectedRequest(mock.expectedRequest, this)
          let matchFound = "No request matched the expected request"
          for (const request of mock.requests) {
            if (request.includes(expectedRequest)) {
              matchFound = "Yes"
              break
            }
          }

          expect(matchFound).toBe("Yes")
        } else {
          const { expectedRequest } = mock
          expect(mock.requests.length).toBe(1)
          expect(mock.requests[0]).toMatch(expectedRequest)
        }
      }

      mockCount += 1
    })
    expect(mockCount).toEqual(this.mocks.length)
  }
}

export const pncNotUpdated = async function (this: Bichard) {
  // Wait 3 seconds to give the backend time to process
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 3000))
  if (this.config.realPNC) {
    if (skipPNCValidation) {
      return
    }

    const specFolder = path.dirname(this.featureUri)
    const result = await this.pnc.checkRecord(specFolder)
    const before = fs.readFileSync(`${specFolder}/pnc-data.before.xml`).toString().trim()
    const after = fs.readFileSync(`${specFolder}/pnc-data.after.xml`).toString().trim()
    expect(result).toBeTruthy()
    expect(before).toEqual(after)
  } else {
    let mockCount = 0
    const updateMocks = this.mocks.filter((mock) => mock.matchRegex.startsWith("CXU") && !mock.response.match(/<TXT>/))
    const mockResponsePromises = updateMocks.map(({ id }) => this.pnc.getMock(id))
    const mockResponses = await Promise.all(mockResponsePromises)
    mockResponses.forEach((mock: PncMock) => {
      expect(mock.requests.length).toBe(0)
      mockCount += 1
    })
    expect(mockCount).toEqual(updateMocks.length)
  }
}

export const pncUpdateIncludes = async function (this: Bichard, data: string) {
  if (this.config.realPNC) {
    return
  }

  await fetchMocks(this)
  const updateMocks = this.mocks.filter((mock) => mock.matchRegex.startsWith("CXU"))
  const checkedMocks = updateMocks.filter((mock) => mock.requests.length > 0 && mock.requests[0].includes(data))
  expect(checkedMocks.length).toEqual(1)
}

export const noPncRequests = async function (this: Bichard) {
  if (this.config.realPNC) {
    return
  }

  const requests = await this.pnc.getRequests()
  expect(requests.length).toEqual(0)
}

export const noPncUpdates = async function (this: Bichard) {
  if (this.config.realPNC) {
    return
  }

  const requests = await this.pnc.getRequests()
  const updates = requests.filter((req: { request: string | string[] }) => req.request.includes("<CXU"))
  expect(updates.length).toEqual(0)
}
