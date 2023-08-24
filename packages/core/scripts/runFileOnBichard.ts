import getFile from "../phase1/comparison/lib/getFile"
import type { ImportedComparison } from "../phase1/comparison/types/ImportedComparison"
import ActiveMqHelper from "../phase1/tests/helpers/ActiveMqHelper"
import defaults from "../phase1/tests/helpers/defaults"
import { mockAhoRecordInPnc } from "../phase1/tests/helpers/mockRecordInPnc"

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

const main = async () => {
  const filename = process.argv[2]
  const fileContents = await getFile(filename, true)
  const comparison = JSON.parse(fileContents) as ImportedComparison
  runFileOnBichard(comparison)
}

export default runFileOnBichard

if (require.main === module) {
  main()
}
