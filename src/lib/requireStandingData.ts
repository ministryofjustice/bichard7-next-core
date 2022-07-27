/* eslint-disable @typescript-eslint/no-var-requires */
import type { KeyValue } from "src/types/KeyValue"
import * as packageInfo from "src/../package.json"
import logger from "./logging"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type StandingData = typeof import("bichard7-next-data-latest").default

const versions = Object.keys(packageInfo.dependencies)
  .filter((d) => d.startsWith("bichard7-next-data-"))
  .reduce((acc: KeyValue<StandingData>, v) => {
    const version = v.replace("bichard7-next-data-", "")
    acc[version] = require(`node_modules/bichard7-next-data-${version}/dist`)
    return acc
  }, {})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireStandingData = (): StandingData => {
  const dataVersion = (global as any).dataVersion as string
  if (!dataVersion) {
    return versions.latest
  }

  const version = versions[dataVersion]
  if (version) {
    return version
  }

  logger.error(`Standing data version not found: ${dataVersion}`)
  return versions.latest
}

export default requireStandingData
