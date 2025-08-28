import type { IWorldOptions } from "@cucumber/cucumber"
import { World } from "@cucumber/cucumber"
import ActiveMqHelper from "@moj-bichard7/common/mq/ActiveMqHelper"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import AuditLogApiHelper from "../helpers/AuditLogApiHelper"
import BrowserHelper from "../helpers/BrowserHelper"
import BrowserHelperEdge from "../helpers/BrowserHelperEdge"
import IncomingMessageBucket from "../helpers/IncomingMessageBucket"
import PostgresHelper from "../helpers/PostgresHelper"
import type PoliceApi from "../types/PoliceApi"
import type PoliceApiRequestMock from "../types/PoliceApiRequestMock"
import { config, type Config } from "./config"
import defaults from "./defaults"
import { LedsApi } from "./LedsApi"
import { PncApi } from "./PncApi"

const ActualBrowserHelper = process.env.MS_EDGE === "true" ? BrowserHelperEdge : BrowserHelper

class Bichard extends World {
  currentTestGivenNames1: string[][]
  currentTestGivenNames2: string[][]
  currentTestFamilyNames: string[][]
  currentProsecutorReference: string[][]
  currentPTIURNValues: string[][]
  currentPTIURN: string
  currentCorrelationId: string | null
  config: Config
  db: PostgresHelper
  mq: ActiveMqHelper
  incomingMessageBucket: IncomingMessageBucket
  policeApi: PoliceApi
  browser: BrowserHelper
  auditLogApi: AuditLogApiHelper
  outputDir: string
  featureUri: string
  recordId: string
  mocks: PoliceApiRequestMock[]
  correlationIds: string[] = []
  testId?: string

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
      host: process.env.DB_HOST || defaults.postgresHost,
      port: Number(process.env.DB_PORT || defaults.postgresPort),
      database: "bichard",
      user: process.env.DB_USER || defaults.postgresUser,
      password: process.env.DB_PASSWORD || defaults.postgresPassword,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
    })

    this.mq = new ActiveMqHelper({
      url: process.env.MQ_URL || defaults.mqUrl,
      login: process.env.MQ_USER || defaults.mqUser,
      password: process.env.MQ_PASSWORD || defaults.mqPassword
    })

    this.incomingMessageBucket = new IncomingMessageBucket({
      url: process.env.AWS_URL || defaults.awsUrl,
      region: process.env.S3_REGION || defaults.awsRegion,
      incomingMessageBucketName: process.env.S3_INCOMING_MESSAGE_BUCKET || defaults.incomingMessageBucket
    })

    this.policeApi =
      process.env.USE_LEDS === "true" ? new LedsApi(this) : new PncApi(this, process.env.SKIP_PNC_VALIDATION === "true")

    this.browser = new ActualBrowserHelper({
      baseUrl: config.baseUrl,
      headless: process.env.HEADLESS !== "false",
      record: process.env.RECORD === "true",
      world: this
    })

    this.auditLogApi = new AuditLogApiHelper({
      apiUrl: process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010",
      apiKey: process.env.AUDIT_LOG_API_KEY ?? "xxx"
    })
  }

  setCorrelationId(correlationId: string) {
    this.currentCorrelationId = correlationId
  }

  getRecordName() {
    if (!this.config.parallel) {
      // original
      return `${this.currentTestFamilyNames[1][0]} ${this.currentTestGivenNames1[1][0]}`
    }

    // updated
    return `${this.currentTestFamilyNames[1][1]} ${this.currentTestGivenNames1[1][1]}`
  }

  async dumpData() {
    const data = await this.db.dumpData()
    await fs.writeFile(`${this.outputDir}/db.json`, JSON.stringify(data))
  }
}

export default Bichard
