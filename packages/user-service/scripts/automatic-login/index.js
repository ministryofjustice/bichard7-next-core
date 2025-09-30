import logger from "utils/logger"
const puppeteer = require("puppeteer")
const pgp = require("pg-promise")()

;(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: process.env.HEADLESS !== "false"
  })
  const page = await browser.newPage()

  const db = pgp({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "bichard",
    user: process.env.DB_USER || "bichard",
    password: process.env.DB_PASSWORD || "password",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
  })

  const query = `
    SELECT u.email
    FROM br7own.users u
    JOIN br7own.users_groups ug
      ON u.id = ug.user_id
    JOIN br7own.groups g
      ON ug.group_id = g.id
    WHERE g.name = $1
  `

  const users = await db.many(query, ["B7Supervisor_grp"])
  const total = users.length
  let current = 0

  logger.info(`Will log in ${total} users...`)

  for (const user of users) {
    logger.info(`${++current}/${total} - ${user.email}`)

    await page.goto(process.env.LOGIN_URL)
    await page.waitForSelector("#email")
    await page.type("#email", user.email)
    await page.click("button[type='submit']")
    await page.waitForSelector("h1[data-test='check-email']")
  }

  await browser.close()
})()
