import type { AxiosResponse } from "axios"
import axiosClass from "axios"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import https from "https"
import tls from "tls"
import Poller from "../utils/Poller"
import { isError } from "../utils/isError"
import type { PncMock } from "../utils/pnc"

tls.DEFAULT_MIN_VERSION = "TLSv1"

const parser = new XMLParser()

const axios = axiosClass.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})
const axiosConfig = { validateStatus: () => true }
const updateExpectations = process.env.UPDATE_PNC_EXPECTATIONS === "true"

const extractNamesFromNCM = (ncmFile: string) => {
  const xmlData = fs.readFileSync(ncmFile, "utf8").toString()

  const parsed = parser.parse(xmlData)
  const surname =
    parsed.NewCaseMessage.Case.Defendant.PoliceIndividualDefendant.PersonDefendant.BasePersonDetails.PersonName
      .PersonFamilyName
  const forename =
    parsed.NewCaseMessage.Case.Defendant.PoliceIndividualDefendant.PersonDefendant.BasePersonDetails.PersonName
      .PersonGivenName1
  return { forename, surname }
}

const extractNamesFromMessage = (messageFile: string) => {
  const xmlData = fs.readFileSync(messageFile, "utf8").toString()

  const parsed = parser.parse(xmlData)
  const surname =
    parsed.DeliverRequest.Message["DC:ResultedCaseMessage"]["DC:Session"]["DC:Case"]["DC:Defendant"][
      "DC:CourtIndividualDefendant"
    ]["DC:PersonDefendant"]["DC:BasePersonDetails"]["DC:PersonName"]["DC:PersonFamilyName"]
  const forename =
    parsed.DeliverRequest.Message["DC:ResultedCaseMessage"]["DC:Session"]["DC:Case"]["DC:Defendant"][
      "DC:CourtIndividualDefendant"
    ]["DC:PersonDefendant"]["DC:BasePersonDetails"]["DC:PersonName"]["DC:PersonGivenName1"]
  return { forename, surname }
}

const removeVariableData = (data: string, format: string) => {
  // Remove the data that changes each time
  if (format === "html") {
    return data
      .replace(/Print of PNC Record: [^<]*</g, "Print of PNC Record: XXXX/XX<")
      .replace(/CCRef: <\/strong>[^<]*</g, "CCRef: </strong>XX/XXXX/XX<")
  }

  return data
    .replace(/PNCID="[^"]*"/g, 'PNCID="XXXX/XX"')
    .replace(/COURT-CASE-REF="[^"]*"/g, 'COURT-CASE-REF="XX/XXXX/XX"')
    .replace(/\s+<GMH.*\/>/g, "")
    .replace(/\s+<GMT.*\/>/g, "")
}

const extractNameFromFiles = (specFolder: string) => {
  const ncmFile = `${specFolder}/pnc-data.xml`
  const messageFile = `${specFolder}/input-message.xml`
  if (fs.existsSync(ncmFile)) {
    return extractNamesFromNCM(ncmFile)
  }

  if (fs.existsSync(messageFile)) {
    return extractNamesFromMessage(messageFile)
  }

  const names = fs
    .readdirSync(specFolder)
    .filter((f) => f.match(/input-message-\d\.xml/))
    .map((f) => `${specFolder}/${f}`)
    .map(extractNamesFromMessage)
  const uniqueNames = [...new Set(names.map((n) => `${n.forename}${n.surname}`))]
  if (uniqueNames.length !== 1) {
    throw new Error("Multiple input messages with multiple names not allowed")
  }

  return names[0]
}

type PNCTestToolOptions = {
  baseUrl: string
}

class PNCTestTool {
  baseUrl: string
  options: PNCTestToolOptions

  constructor(options: PNCTestToolOptions) {
    this.options = options
    if (!options.baseUrl) {
      throw new Error("Error: PNC_TEST_TOOL environment variable is not set")
    }

    this.baseUrl = options.baseUrl
  }

  async setupRecord(specFolder: string) {
    let existingRecord: string | false
    const ncmFile = `${specFolder}/pnc-data.xml`
    const name = extractNameFromFiles(specFolder)

    // Check if it exists first
    existingRecord = await this.fetchRecord(name, "xml")

    if (fs.existsSync(ncmFile) && !existingRecord) {
      // Insert the record
      await this.createRecord(ncmFile)
      existingRecord = await this.fetchRecord(name, "xml")
    }

    // Check it matches our expected start state
    if (!existingRecord || isError(existingRecord)) {
      throw new Error("Could not fetch record from PNC")
    }

    const beforePath = `${specFolder}/pnc-data.before.xml`
    if (updateExpectations) {
      fs.writeFileSync(beforePath, existingRecord)
      // Fetch the HTML version too for easier comparison
      const existingRecordHTML = await this.fetchRecord(name, "html")
      if (existingRecordHTML) {
        fs.writeFileSync(beforePath.replace(".xml", ".html"), existingRecordHTML)
      }
    }

    const beforeState = fs.readFileSync(beforePath).toString().trim()
    if (existingRecord !== beforeState) {
      throw new Error("PNC record does not match expected before state")
    }
  }

  async checkRecord(specFolder: string): Promise<boolean> {
    const name = extractNameFromFiles(specFolder)

    // Retrieve the record
    const record = await this.fetchRecord(name, "xml")
    if (!record || isError(record)) {
      throw new Error("Could not fetch record from PNC")
    }

    const afterPath = `${specFolder}/pnc-data.after.xml`
    if (updateExpectations) {
      fs.writeFileSync(afterPath, record)
      // Fetch the HTML version too for easier comparison
      const recordHTML = await this.fetchRecord(name, "html")
      if (recordHTML) {
        fs.writeFileSync(afterPath.replace(".xml", ".html"), recordHTML)
      }
    }

    const afterState = fs.readFileSync(afterPath).toString().trim()
    return record === afterState
  }

  fetchRecord(options: { forename: string; surname: string }, format: string): Promise<string | false> {
    const action = (): Promise<AxiosResponse | false> => {
      const url = `${
        this.baseUrl
      }/query.php?forename=${options.forename.toUpperCase()}&surname=${options.surname.toUpperCase()}&format=${format}`

      try {
        return axios.get(url, { ...axiosConfig, timeout: 1000 })
      } catch (err) {
        return Promise.resolve(false)
      }
    }

    const condition = (resp: AxiosResponse | false): boolean => resp && (resp.status === 200 || resp.status === 404)

    return new Poller<AxiosResponse | false>(action)
      .poll({
        condition,
        timeout: 10000,
        delay: 1000,
        name: "PNC Test Tool query request poller"
      })
      .then((result: AxiosResponse | false) => {
        if (!result || result.status !== 200) {
          return false
        }

        return removeVariableData(result.data, format).trim()
      })
      .catch((error) => error)
  }

  async createRecord(ncmFile: string) {
    const xmlData = fs.readFileSync(ncmFile, "utf8").toString()
    const url = `${this.baseUrl}/create.php`
    try {
      await axios.post(url, xmlData, { timeout: 5000 })
    } catch (err) {
      console.log((err as Error).message)
      throw new Error("Error creating record in PNC")
    }
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars, @typescript-eslint/no-unused-vars
  addMock(_matchRegex: string, _response: string, _count?: number) {
    throw new Error("addMock incorrectly called for PNCTestTool")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  awaitMockRequest(_id: string, _timeout = 40000) {
    throw new Error("awaitMockRequest incorrectly called for PNCTestTool")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMock(_id: string): Promise<PncMock> {
    throw new Error("getMock incorrectly called for PNCTestTool")
  }

  getRequests() {
    throw new Error("getMock incorrectly called for PNCTestTool")
  }
}

export default PNCTestTool
