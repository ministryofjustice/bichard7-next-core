import { After, Before, BeforeAll } from "@cucumber/cucumber"
import fs from "fs"

const recordComparisons = process.env.RECORD_COMPARISONS === "true"
const comparisonOutDir = "comparisons"

const extractTestId = (featureUri: string) => {
  const match = featureUri.match(/features\/([^-]*)-.*/)
  return match ? match[1] : undefined
}

export const setupHooks = () => {
  BeforeAll(() => {
    const clearRecordings = process.env.CLEAR_RECORDINGS !== "false"
    if (clearRecordings) {
      try {
        fs.rmSync("./screenshots", { recursive: true })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Screenshots directory did not exist")
      }
    }
  })

  // eslint-disable-next-line consistent-return
  Before(async function (context) {
    this.featureUri = context.gherkinDocument.uri
    // eslint-disable-next-line prefer-destructuring
    this.testId = extractTestId(this.featureUri)
    if (recordComparisons) {
      if (
        fs.existsSync(`${comparisonOutDir}/test-${this.testId}.json`) ||
        fs.existsSync(`${comparisonOutDir}/test-${this.testId}-1.json`)
      ) {
        console.log(`Skipping ${this.testId}`)
        return "pending"
      }
    }

    const featureName = this.featureUri.split("/").slice(-2)[0]
    this.outputDir = `./screenshots/${featureName}/${new Date().getTime()}`
    if (process.env.RECORD === "true") {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }

    await this.browser.setupDownloadFolder("./tmp")
    if (!this.config.parallel) {
      await this.db.clearExceptions()
      if (!this.config.realPNC) {
        await this.pnc.clearMocks()
      }
    }
  })

  After(async function (hook) {
    const status = hook.result?.status

    await this.browser.close()
    if (process.env.RECORD === "true") {
      if (!this.config.realPNC) {
        await this.pnc.recordMocks()
        await this.pnc.recordRequests()
      }

      await this.dumpData()
    }

    if (recordComparisons && status === "PASSED") {
      const comparisons = await this.mq.getMessages("PROCESSING_VALIDATION_QUEUE")
      if (!fs.existsSync(comparisonOutDir)) {
        fs.mkdirSync(comparisonOutDir)
      }

      comparisons.forEach(async (comparison: string, index: number) => {
        const subFile = comparisons.length > 1 ? `-${index}` : ""
        const outFile = `${comparisonOutDir}/test-${this.testId}${subFile}.json`
        const formatted = JSON.stringify(JSON.parse(comparison), null, 2)
        await fs.promises.writeFile(outFile, formatted)
      })
    }
  })
}
