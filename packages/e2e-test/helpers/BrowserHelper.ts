import fs from "fs"
import type { Browser, Page } from "puppeteer"
import puppeteer from "puppeteer"
import PuppeteerMassScreenshots from "puppeteer-mass-screenshots"
import { authType } from "../utils/config"
import { logout } from "../utils/urls"
import type Bichard from "../utils/world"

let browser: Browser | undefined

type BrowserHelperOptions = {
  baseUrl: string
  headless: boolean
  record: boolean
  world: Bichard
}

class BrowserHelper {
  options: BrowserHelperOptions
  browser: Browser | null
  currentPage: Page | null
  authTokenCookie: string | null
  recorder: PuppeteerMassScreenshots
  defaultArgsForPuppeteer = [
    // Required for Docker version of Puppeteer
    "--no-sandbox",
    "--disable-setuid-sandbox",
    // This will write shared memory files into /tmp instead of /dev/shm,
    // because Docker's default for /dev/shm is 64MB
    "--disable-dev-shm-usage",
    "--window-size=1024,1024",
    "--lang=en_GB"
  ]

  constructor(options: BrowserHelperOptions) {
    this.options = options
    this.browser = null
    this.currentPage = null
    this.authTokenCookie = null
  }

  async newPage(path: string) {
    if (!browser) {
      browser = await puppeteer.launch({
        acceptInsecureCerts: true,
        headless: this.options.headless,
        args: this.defaultArgsForPuppeteer
      })
    }

    const context = await browser.createBrowserContext()
    this.currentPage = await context.newPage()
    await this.currentPage.setViewport({
      width: 1024,
      height: 1024
    })
    await this.currentPage.setExtraHTTPHeaders({
      "Accept-Language": "en_GB"
    })
    await this.record()
    await this.visitUrl(path)
    return this.currentPage
  }

  setAuthCookie(value: string) {
    this.authTokenCookie = value
  }

  get page(): Page {
    if (!this.currentPage) {
      throw new Error("Page does not exist")
    }

    return this.currentPage
  }

  async record() {
    if (this.options.record) {
      this.recorder = new PuppeteerMassScreenshots()
      const outputDir = `${this.options.world.outputDir}/images`
      fs.mkdirSync(outputDir, { recursive: true })
      await this.recorder.init(this.page, outputDir, {
        afterWritingImageFile: () => {}
      })
      await this.recorder.start()
    }
  }

  async visitUrl(url: string) {
    if (this.authTokenCookie) {
      await this.page.setCookie({
        name: ".AUTH",
        value: this.authTokenCookie,
        url,
        path: "/"
      })
    }

    await this.page.goto(url)
    return this.page
  }

  async logout() {
    if (this.currentPage) {
      await this.currentPage.goto(logout())
      await this.currentPage.waitForSelector("input[type=submit][value=OK]")
      await this.currentPage.click("input[type=submit][value=OK]")

      const selector = this.options.world.config.authType === authType.bichard ? "#username" : ".infoMessage"
      await this.currentPage.waitForSelector(selector)
    }
  }

  async close() {
    if (this.recorder) {
      await this.recorder.stop()
    }

    if (this.currentPage) {
      this.currentPage.close()
    }
  }

  elementText(selector: string) {
    return this.page.evaluate((sel) => document.querySelector<HTMLElement>(sel)?.innerText, selector)
  }

  pageText() {
    return this.page.evaluate(() => document.body.innerText)
  }

  async clickLinkAndWait(text: string) {
    const linkHandlers = await this.page.$$(`xpath/.//a[normalize-space()='${text}']`)
    if (linkHandlers.length !== 1) {
      throw new Error(`${linkHandlers.length} links found for ${text} - should be 1`)
    }

    await Promise.all([linkHandlers[0].click(), this.page.waitForNavigation()])
  }

  clickAndWait(selector: string) {
    return Promise.all([this.page.click(selector), this.page.waitForNavigation()])
  }

  async setupDownloadFolder(folder: string) {
    if (fs.existsSync("./tmp")) {
      fs.rmSync("./tmp", { recursive: true })
    }

    if (this.currentPage) {
      const cdpSession = await this.currentPage.createCDPSession()
      cdpSession.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: folder })
    }
  }

  async selectDropdownOption(dropdownId: string, text: string) {
    const option = (await this.page.$$(`xpath/.//*[@id = "${dropdownId}"]/option[text() = "${text}"]`))[0]
    const value = (await (await option.getProperty("value")).jsonValue()) as string
    await this.page.select(`#${dropdownId}`, value)
  }
}

export default BrowserHelper
