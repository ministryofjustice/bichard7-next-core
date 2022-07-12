import fs from "fs"
import ActiveMqHelper from "tests/helpers/ActiveMqHelper"
import defaults from "tests/helpers/defaults"
import { mockAhoRecordInPnc } from "tests/helpers/mockRecordInPnc"
import type { ImportedComparison } from "./Types/ImportedComparison"

const main = async () => {
  const filename = process.argv[2]
  const fileContents = fs.readFileSync(filename, { encoding: "utf-8" })
  const fileJson = JSON.parse(fileContents) as ImportedComparison

  // Insert matching record in PNC
  await mockAhoRecordInPnc(fileJson.annotatedHearingOutcome)

  // Push the message to MQ
  const mq = new ActiveMqHelper({
    url: process.env.MQ_URL || defaults.mqUrl,
    login: process.env.MQ_USER || defaults.mqUser,
    password: process.env.MQ_PASSWORD || defaults.mqPassword
  })
  await mq.sendMessage("COURT_RESULT_INPUT_QUEUE", fileJson.incomingMessage)
}

main()
