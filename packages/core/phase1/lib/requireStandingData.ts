/* eslint-disable @typescript-eslint/no-var-requires */
import logger from "@moj-bichard7/common/utils/logger"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type StandingData = typeof import("bichard7-next-data-latest").default

const importDataRepoVersion = (version: string): StandingData | undefined => {
  try {
    // Webpack friendly format for import
    return require(`node_modules/bichard7-next-data-${version}/dist`) as StandingData
  } catch (e) {
    logger.debug(`Webpack import of bichard7-next-data-${version} failed, retrying in npm format: ${e}`)
    try {
      // Npm friendly format for import
      return require(`bichard7-next-data-${version}/dist`) as StandingData
    } catch (e1) {
      logger.warn(`Npm and Webpack formatted import of bichard7-next-data-${version} failed: ${e1}`)
      return undefined
    }
  }
}

const cachedStandingDataModules: Record<string, StandingData> = {}

const getStandingDataModule = (version: string): StandingData => {
  if (cachedStandingDataModules[version]) {
    return cachedStandingDataModules[version]
  }

  const standingDataModule = importDataRepoVersion(version)

  if (standingDataModule) {
    cachedStandingDataModules[version] = standingDataModule
  }

  return cachedStandingDataModules[version]
}

const requireStandingData = (): StandingData => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataVersion = (global as any).dataVersion as string
  if (!dataVersion) {
    return getStandingDataModule("latest")
  }

  const version = getStandingDataModule(dataVersion)
  if (version) {
    return version
  }

  logger.error(`Standing data version not found: ${dataVersion}`)
  return getStandingDataModule("latest")
}

export default requireStandingData
