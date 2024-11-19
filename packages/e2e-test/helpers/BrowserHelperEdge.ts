import type { Browser } from "puppeteer"

import puppeteer from "puppeteer"

import BrowserHelper from "./BrowserHelper"

const edgePaths: Record<string, string> = {
  darwin: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  linux: "/usr/bin/microsoft-edge-dev",
  win32: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
}

let browser: Browser | undefined

class BrowserHelperEdge extends BrowserHelper {
  async newPage(path: string) {
    if (!browser) {
      browser = await puppeteer.launch({
        acceptInsecureCerts: true,
        args: [
          "--ignore-certificate-errors",
          "--ignore-certificate-errors-spki-list",
          "--enable-features=NetworkService",
          ...this.defaultArgsForPuppeteer
        ],
        executablePath: edgePaths[process.platform],
        headless: this.options.headless
      })
    }

    const context = await browser.createBrowserContext()
    this.currentPage = await context.newPage()
    await this.page.setViewport({
      height: 1024,
      width: 1024
    })
    await this.currentPage.setExtraHTTPHeaders({
      "Accept-Language": "en_GB"
    })
    await this.record()
    await this.visitUrl(path)
    return this.currentPage
  }
}

export default BrowserHelperEdge
