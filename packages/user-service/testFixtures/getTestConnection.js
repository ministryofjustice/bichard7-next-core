import { PG_PROMISE_TEST_CONNECTION_NAME } from "./testConfig"
import config from "../src/lib/config"
import getConnection from "../src/lib/getConnection"

const getTestConnection = () => getConnection(PG_PROMISE_TEST_CONNECTION_NAME, config.debugMode === "true")

export default getTestConnection
