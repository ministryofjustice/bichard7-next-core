import type { IWorldOptions } from "@cucumber/cucumber"

import { World } from "@cucumber/cucumber"
import ActiveMqHelper from "@moj-bichard7/common/mq/ActiveMqHelper"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"

import type { PncMock } from "./pnc"

import AuditLogApiHelper from "../helpers/AuditLogApiHelper"
import BrowserHelper from "../helpers/BrowserHelper"
import BrowserHelperEdge from "../helpers/BrowserHelperEdge"
import IncomingMessageBucket from "../helpers/IncomingMessageBucket"
import MockPNCHelper from "../helpers/MockPNCHelper"
import PNCTestTool from "../helpers/PNCTestTool"
import PostgresHelper from "../helpers/PostgresHelper"
import { config, type Config } from "./config"
import defaults from "./defaults"

const ActualBrowserHelper = process.env.MS_EDGE === "true" ? BrowserHelperEdge : BrowserHelper

class Bichard extends World {
  auditLogApi: AuditLogApiHelper
  browser: BrowserHelper
  config: Config
  currentCorrelationId: null | string
  currentProsecutorReference: string[][]
  currentPTIURN: string
  currentPTIURNValues: string[][]
  currentTestFamilyNames: string[][]
  currentTestGivenNames1: string[][]
  currentTestGivenNames2: string[][]
  db: PostgresHelper
  featureUri: string
  incomingMessageBucket: IncomingMessageBucket
  mocks: PncMock[]
  mq: ActiveMqHelper
  outputDir: string
  pnc: MockPNCHelper | PNCTestTool
  recordId: string

  constructor() {
    super({} as IWorldOptions)

    this.config = config

    this.currentTestGivenNames1 = []
    this.currentTestGivenNames2 = []
    this.currentTestFamilyNames = []
    this.currentProsecutorReference = []
    this.currentPTIURNValues = []
    this.currentPTIURN = randomUUID()
    this.currentCorrelationId = null

    this.db = new PostgresHelper({
      database: "bichard",
      host: process.env.DB_HOST || defaults.postgresHost,
      password: process.env.DB_PASSWORD || defaults.postgresPassword,
      port: Number(process.env.DB_PORT || defaults.postgresPort),
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      user: process.env.DB_USER || defaults.postgresUser
    })

    this.mq = new ActiveMqHelper({
      login: process.env.MQ_USER || defaults.mqUser,
      password: process.env.MQ_PASSWORD || defaults.mqPassword,
      url: process.env.MQ_URL || defaults.mqUrl
    })

    this.incomingMessageBucket = new IncomingMessageBucket({
      incomingMessageBucketName: process.env.S3_INCOMING_MESSAGE_BUCKET || defaults.incomingMessageBucket,
      region: process.env.S3_REGION || defaults.awsRegion,
      url: process.env.AWS_URL || defaults.awsUrl
    })

    if (this.config.realPNC) {
      this.pnc = new PNCTestTool({
        baseUrl: process.env.PNC_TEST_TOOL ?? ""
      })
    } else {
      this.pnc = new MockPNCHelper({
        host: process.env.PNC_HOST || defaults.pncHost,
        port: Number(process.env.PNC_PORT || defaults.pncPort),
        world: this
      })
    }

    this.browser = new ActualBrowserHelper({
      baseUrl: config.baseUrl,
      headless: process.env.HEADLESS !== "false",
      record: process.env.RECORD === "true",
      world: this
    })

    this.auditLogApi = new AuditLogApiHelper({
      apiKey: process.env.AUDIT_LOG_API_KEY ?? "xxx",
      apiUrl: process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010"
    })
  }

  async dumpData() {
    const data = await this.db.dumpData()
    await fs.writeFile(`${this.outputDir}/db.json`, JSON.stringify(data))
  }

  getRecordName() {
    if (!this.config.parallel) {
      // original
      return `${this.currentTestFamilyNames[1][0]} ${this.currentTestGivenNames1[1][0]}`
    }

    // updated
    return `${this.currentTestFamilyNames[1][1]} ${this.currentTestGivenNames1[1][1]}`
  }

  setCorrelationId(correlationId: string) {
    this.currentCorrelationId = correlationId
  }
}

export default Bichard
