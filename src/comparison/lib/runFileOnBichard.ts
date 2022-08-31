import fs from "fs"
import ActiveMqHelper from "../../../tests/helpers/ActiveMqHelper"
import defaults from "../../../tests/helpers/defaults"
import { mockAhoRecordInPnc } from "../../../tests/helpers/mockRecordInPnc"
import type { ImportedComparison } from "../Types/ImportedComparison"

const runFileOnBichard = async (comparison: ImportedComparison): Promise<void> => {
  // Insert matching record in PNC
  await mockAhoRecordInPnc(comparison.annotatedHearingOutcome)

  // Push the message to MQ
  const mq = new ActiveMqHelper({
    url: process.env.MQ_URL || defaults.mqUrl,
    login: process.env.MQ_USER || defaults.mqUser,
    password: process.env.MQ_PASSWORD || defaults.mqPassword
  })
  if (comparison.incomingMessage.match(/DeliverRequest/)) {
    await mq.sendMessage("COURT_RESULT_INPUT_QUEUE", comparison.incomingMessage)
  } else {
    await mq.sendMessage("HEARING_OUTCOME_INPUT_QUEUE", comparison.incomingMessage)
  }
}

export default runFileOnBichard

if (require.main === module) {
  const filename = process.argv[2]
  const fileContents = fs.readFileSync(filename, { encoding: "utf-8" })
  const comparison = JSON.parse(fileContents) as ImportedComparison
  runFileOnBichard(comparison)
}
