import type {
  Comparison,
  OldPhase1Comparison,
  Phase1Comparison,
  Phase2Comparison
} from "../comparison/types/ComparisonFile"

import getFile from "../comparison/lib/getFile"
import ActiveMqHelper from "../phase1/tests/helpers/ActiveMqHelper"
import defaults from "../phase1/tests/helpers/defaults"
import { mockAhoRecordInPnc } from "../phase1/tests/helpers/mockRecordInPnc"

const mq = new ActiveMqHelper({
  login: process.env.MQ_USER || defaults.mqUser,
  password: process.env.MQ_PASSWORD || defaults.mqPassword,
  url: process.env.MQ_URL || defaults.mqUrl
})

const runFileOnBichardPhase1 = async (comparison: OldPhase1Comparison | Phase1Comparison): Promise<void> => {
  // Insert matching record in PNC
  await mockAhoRecordInPnc(comparison.annotatedHearingOutcome)

  // Push the message to MQ
  if (comparison.incomingMessage.match(/DeliverRequest/)) {
    await mq.sendMessage("COURT_RESULT_INPUT_QUEUE", comparison.incomingMessage)
  } else {
    await mq.sendMessage("HEARING_OUTCOME_INPUT_QUEUE", comparison.incomingMessage)
  }
}

const runFileOnBichardPhase2 = async (comparison: Phase2Comparison): Promise<void> => {
  // Push the message to MQ
  if (comparison.incomingMessage.match(/PNCUpdateDataset/)) {
    await mq.sendMessage("DATA_SET_PNC_UPDATE_QUEUE", comparison.incomingMessage)
  } else {
    await mq.sendMessage("HEARING_OUTCOME_PNC_UPDATE_QUEUE", comparison.incomingMessage)
  }
}

const main = async () => {
  const filename = process.argv[2]
  const fileContents = await getFile(filename, true)
  const comparison = JSON.parse(fileContents) as Comparison
  if (!("phase" in comparison) || comparison.phase === 1) {
    runFileOnBichardPhase1(comparison)
  } else if (comparison.phase === 2) {
    runFileOnBichardPhase2(comparison)
  }
}

if (require.main === module) {
  main()
}

export default runFileOnBichardPhase1
