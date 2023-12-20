import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "mq"

const SOURCE_QUEUE = "TEST_PHASE1_RESUBMIT"
const DEST_QUEUE = "TEST_HEARING_OUTCOME_INPUT"

describe("server in MQ mode", () => {})
