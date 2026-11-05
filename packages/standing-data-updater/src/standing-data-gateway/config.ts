export type StandingDataApiConfig = {
  username: string
  password: string
  endPoint: string
}

if (!process.env.SD_USERNAME) {
  throw new Error("SD_USERNAME environment variable is not set")
}

if (!process.env.SD_PASSWORD) {
  throw new Error("SD_PASSWORD environment variable is not set")
}

if (!process.env.SD_END_POINT) {
  throw new Error("SD_END_POINT environment variable is not set")
}

const config: StandingDataApiConfig = {
  username: process.env.SD_USERNAME,
  password: process.env.SD_PASSWORD,
  endPoint: process.env.SD_END_POINT
}

export default config
