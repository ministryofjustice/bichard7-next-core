declare module "puppeteer-mass-screenshots" {
  type Options = {
    afterWritingImageFile: () => void
  }

  class PuppeteerMassScreenshots {
    init(page: Page, outputDir: string, options: Options): void
    start(): void
    stop(): void
  }

  export = PuppeteerMassScreenshots
}

declare let postgresConnection: IDatabase<unknown>
