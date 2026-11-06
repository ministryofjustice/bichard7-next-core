export type PnldConfig = {
  username: string
  password: string
  loginUrl: string
  downloadUrl: string
  headless: boolean
  tmpDir: string
}

if (!process.env.PNLD_USERNAME) {
  throw new Error("PNLD_USERNAME environment variable is not set")
}

if (!process.env.PNLD_PASSWORD) {
  throw new Error("PNLD_PASSWORD environment variable is not set")
}

if (!process.env.PNLD_LOGIN_URL) {
  throw new Error("PNLD_LOGIN_URL environment variable is not set")
}

if (!process.env.PNLD_DOWNLOAD_URL) {
  throw new Error("PNLD_DOWNLOAD_URL environment variable is not set")
}

const config: PnldConfig = {
  username: process.env.PNLD_USERNAME,
  password: process.env.PNLD_PASSWORD,
  loginUrl: process.env.PNLD_LOGIN_URL,
  downloadUrl: process.env.PNLD_DOWNLOAD_URL,
  tmpDir: process.env.TMP_DIR || "./tmp",
  headless: process.env.HEADLESS === "true"
}

export default config
