/* eslint-disable @typescript-eslint/no-var-requires */
import type { KeyValue } from "src/types/KeyValue"
import * as packageInfo from "src/../package.json"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type StandingData = typeof import("bichard7-next-data-latest").default

const versions = Object.keys(packageInfo.dependencies)
  .filter((d) => d.startsWith("bichard7-next-data-"))
  .reduce((acc: KeyValue<StandingData>, v) => {
    const version = v.replace("bichard7-next-data-", "")
    acc[version] = require(v)
    return acc
  }, {})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireStandingData = (): StandingData => versions[(global as any).dataVersion || "latest"]

export default requireStandingData
