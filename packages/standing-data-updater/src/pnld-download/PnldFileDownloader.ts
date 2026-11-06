import * as fs from "fs"
import type { ElementHandle, Browser, Page } from "puppeteer"
import puppeteer from "puppeteer"
import { parse } from "date-fns"
import type { PnldConfig } from "./config"

export type PnldFile = {
  date: Date
  link?: ElementHandle | null
  fileName?: string
}

export default class PnldFileDownloader {
  browser: Browser

  page: Page

  tmpDir: string

  options: PnldConfig

  constructor(options: PnldConfig) {
    this.options = options
  }

  async setupPuppeteer(): Promise<void> {
    this.browser = await puppeteer.launch({
      acceptInsecureCerts: true,
      headless: this.options.headless,
      args: [
        // Required for Docker version of Puppeteer
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // This will write shared memory files into /tmp instead of /dev/shm,
        // because Docker’s default for /dev/shm is 64MB
        "--disable-dev-shm-usage",
        "--window-size=1024x768"
      ]
    })
    this.page = await this.browser.newPage()
    await this.page.setViewport({
      width: 1024,
      height: 768
    })
  }

  async closePuppeteer(): Promise<void> {
    await this.browser.close()
  }

  async setupDownloadFolder(): Promise<void> {
    this.tmpDir = `${this.options.tmpDir}/pnld`
    if (fs.existsSync(this.tmpDir)) {
      await fs.promises.rm(this.tmpDir, { recursive: true })
    }

    await fs.promises.mkdir(this.tmpDir, { recursive: true })
    if (this.page) {
      const client = await this.page.target().createCDPSession()
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: this.tmpDir
      })
    }
  }

  async login(): Promise<void> {
    await this.page.goto(this.options.loginUrl)
    await this.page.waitForSelector("button#next")
    await this.page.type("#logonIdentifier", this.options.username)
    await this.page.type("#password", this.options.password)
    return Promise.all([this.page.click("button#next"), this.page.waitForNavigation()]).then(() => {})
  }

  async waitForZipCount(zipCount: number, timeout: number): Promise<void> {
    for (let i = 0; i < timeout; i++) {
      await new Promise((res) => {
        setTimeout(res, 1000)
      })
      const dir = await fs.promises.readdir(this.tmpDir)
      const count = dir.reduce((acc, filename) => {
        if (filename.endsWith(".zip")) {
          return acc + 1
        }

        return acc
      }, 0)
      if (count === zipCount) {
        return
      }
    }
  }

  async downloadFile(link: ElementHandle): Promise<string> {
    const linkText = await link.evaluate((el) => el.textContent)
    const linkLocation = await link.evaluate((el) => el.getAttribute("href"))
    console.log(`Downloading PNLD file "${linkText}" from ${linkLocation}`)

    const before = await fs.promises.readdir(this.tmpDir)
    await link.scrollIntoView()
    await link.click()
    await this.waitForZipCount(before.length + 1, 60)
    const after = await fs.promises.readdir(this.tmpDir)
    const fileName = after.filter((f) => !before.includes(f))[0]
    const filePath = `${this.tmpDir}/${fileName}`

    console.log(`Downloaded PNLD file "${linkText}" to ${filePath}`)
    return filePath
  }

  async getFileLinks(): Promise<PnldFile[]> {
    const links: PnldFile[] = []
    await this.page.goto(this.options.downloadUrl, { waitUntil: "networkidle2" })
    // The links are in a 4 column table with the date in the 1st column and the link in the second
    const columnCount = 4
    const tds = await this.page.$$(".table-responsive table tbody td")
    const rowCount = tds.length / columnCount
    for (let i = 0; i < rowCount * columnCount; i += columnCount) {
      const date = await tds[i].evaluate((node) => (node as HTMLElement).innerText)
      const link = await tds[i + 1].$("a")
      links.push({ date: parse(date, "dd/MM/yy", new Date()), link })
    }

    return links
  }

  async downloadArchives(): Promise<PnldFile[]> {
    await this.setupDownloadFolder()
    const fileLinks = await this.getFileLinks()

    const cookiesButton = await this.page.$(".closeCookies")
    if (cookiesButton) {
      await cookiesButton.click()
    }

    for (const fileLink of fileLinks) {
      if (fileLink.link) {
        fileLink.fileName = await this.downloadFile(fileLink.link)
      }
    }

    return fileLinks
  }

  async download(): Promise<PnldFile[]> {
    await this.setupPuppeteer()
    await this.login()
    const fileList = await this.downloadArchives()
    await this.closePuppeteer()
    return fileList.map((f) => ({ date: f.date, fileName: f.fileName }))
  }
}
