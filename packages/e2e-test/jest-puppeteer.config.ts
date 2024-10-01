import { config } from "./utils/config"

const puppeteerConfig = {
  browserContext: "incognito",
  launch: {
    baseUrl: config.baseUrl,
    headless: process.env.HEADLESS !== "false",
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage",
      "--ignore-certificate-errors"
    ]
  }
}

module.exports = puppeteerConfig
