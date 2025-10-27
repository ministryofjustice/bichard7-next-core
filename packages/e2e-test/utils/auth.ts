import { expect } from "expect"
import jwt from "jsonwebtoken"
import { authType, config } from "./config"
import dummyUsers from "./dummyUserData"
import { authenticateUrl, login } from "./urls"
import type Bichard from "./world"

const nextui = process.env.NEXTUI === "true"

const tokenSecret = () => process.env.TOKEN_SECRET || "OliverTwist"

const parallelUserName = (world: Bichard, name: string) =>
  world.config.parallel ? `${name}.${world.config.workerId}` : name

const createUser = async (world: Bichard, name: string) => {
  const lowerName = name.toLowerCase()
  if (!(lowerName in dummyUsers)) {
    throw new Error(`Could not find dummy user ${lowerName}`)
  }

  const user = dummyUsers[lowerName]
  const username = parallelUserName(world, name)
  if (!user) {
    throw new Error(`User '${username}' not defined`)
  }

  if (world.db.createUser) {
    await world.db.createUser(
      username,
      user.groups,
      user.inclusionList,
      user.exclusionList,
      user.visible_courts,
      user.visible_forces,
      user.excluded_triggers
    )
  }
}

const logInNormallyAs = async function (world: Bichard, name: string, sameWindow: boolean) {
  const username = parallelUserName(world, name)
  const emailAddress = `${username}@example.com`

  let page

  if (sameWindow) {
    await world.browser.page.waitForSelector('a[data-test="log-back-in"]')
    await world.browser.page.click('a[data-test="log-back-in"]')
    page = world.browser.page
  } else {
    page = await world.browser.newPage(login())
  }

  await page.waitForSelector("#email")

  await page.type("#email", emailAddress)
  await page.type("#password", "password")

  await world.browser.clickAndWait("button[type='submit']")

  await page.waitForSelector("#validationCode")
  // Grab verification code from the database
  const verificationCode = await world.db.getEmailVerificationCode(emailAddress)
  await page.type("#validationCode", verificationCode)
  await world.browser.clickAndWait("button[type='submit']")
  await page.waitForSelector('xpath/.//*[contains(text(), "Welcome ")]')

  if (nextui) {
    const [button] = await page.$$("xpath/.//a[contains(., 'Access New Bichard')]")
    if (button) {
      await Promise.all([button.click(), page.waitForNavigation()])
    }

    return
  }

  await world.browser.clickAndWait("a#bichard-link")
  await page.waitForSelector(".wpsToolBarUserName", { timeout: config.timeout })
}

const logInDirectToBichardWithJwtAs = async function (world: Bichard, name: string) {
  const user = dummyUsers[name.toLowerCase()]
  const username = parallelUserName(world, name)

  if (!user) {
    throw new Error(`Could not find user data for ${username}`)
  }

  const tokenData = {
    username,
    exclusionList: user.exclusionList,
    inclusionList: user.inclusionList,
    forenames: "Bichard User",
    surname: "01",
    emailAddress: `${username}@example.com`,
    groups: user.groups,
    iat: 1626187368,
    exp: 9999999999,
    iss: "Bichard"
  }
  const token = jwt.sign(tokenData, tokenSecret())
  const url = authenticateUrl(token)
  await world.browser.setAuthCookie(token)
  const page = await world.browser.newPage(url)
  await page.waitForSelector(".wpsToolBarUserName", { timeout: config.timeout })
}

const logIn = async function (world: Bichard, username: string, sameWindow: boolean) {
  if (world.config.noUi) {
    return
  }

  await createUser(world, username)

  if (world.config.authType === authType.bichardJwt) {
    await logInDirectToBichardWithJwtAs(world, username)
  } else {
    await logInNormallyAs(world, username, sameWindow)
  }

  const match = nextui ? new RegExp(username, "i") : new RegExp(`You are logged in as: ${username}`, "i")
  expect(await world.browser.pageText()).toMatch(match)
}

export const logInAsSameWindow = async function (this: Bichard, username: string) {
  const sameWindow = true

  await logIn(this, username, sameWindow)
}

export const logInAs = async function (this: Bichard, username: string) {
  const sameWindow = false

  await logIn(this, username, sameWindow)
}
