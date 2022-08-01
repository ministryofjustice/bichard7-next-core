/* eslint-disable @typescript-eslint/no-var-requires */
import type { KeyValue } from "../types/KeyValue"
import * as packageInfo from "../../package.json"
import logger from "./logging"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type StandingData = typeof import("bichard7-next-data-latest").default

const importDataRepoVersion = (version: string, acc: KeyValue<StandingData>): KeyValue<StandingData> => {
  try {
    // Webpack friendly format for import
    acc[version] = require(`node_modules/bichard7-next-data-${version}/dist`)
  } catch (e) {
    logger.debug(`Webpack import of bichard7-next-data-${version} failed, retrying in npm format: ${e}`)
    try {
      // Npm friendly format for import
      acc[version] = require(`bichard7-next-data-${version}/dist`)
    } catch (e1) {
      logger.warn(`Npm and Webpack formatted import of bichard7-next-data-${version} failed: ${e1}`)
    } finally {
      return acc
    }
  } finally {
    return acc
  }
}

const versions = Object.keys(packageInfo.dependencies)
  .filter((d) => d.startsWith("bichard7-next-data-"))
  .reduce((acc: KeyValue<StandingData>, v) => {
    return importDataRepoVersion(v.replace("bichard7-next-data-", ""), acc)
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
