type Court = {
  courtIdentityType: string
  courtCode: string
}
type CurrentAppearance = {
  court: Court
}

type NextAppearance = {
  date: string
  court: Court
}

export type RemandDetails = {
  appearanceResult: string
  ownerCode: string
  remandDate: string
  currentAppearance: CurrentAppearance
  nextAppearance: NextAppearance
  remandConditions: string[]
}

type RemandResponse = {
  remandId: string
  lastUpdatedDate: string
  arrestSummonsReference: string
  content: RemandDetails
  versionToChange: string
}

export default RemandResponse
