import fs from "fs"
import type ExcludedTriggerConfig from "src/types/ExcludedTriggerConfig"

const prodConfigFile = "data/excluded-trigger-config.json"
const testConfigFile = "data/excluded-trigger-config.test.json"

const configFile = process.env.NODE_ENV === "test" ? testConfigFile : prodConfigFile

const config = fs.readFileSync(configFile)
if (!config) {
  throw new Error(`Unable to load excluded trigger config from ${configFile}`)
}

const parsedConfig = JSON.parse(config.toString()) as ExcludedTriggerConfig

export default parsedConfig
