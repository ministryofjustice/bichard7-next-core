// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import type { ImportedComparison } from "core/phase1/src/comparison/types/ImportedComparison"
import ActiveMqHelper from "core/phase1/tests/helpers/ActiveMqHelper"
import defaults from "core/phase1/tests/helpers/defaults"
import crypto from "crypto"
import fs from "fs"
import runFileOnBichard from "./runFileOnBichard"

const queueName = "PROCESSING_VALIDATION_QUEUE"

const generateHash = (message: string): string => crypto.createHash("sha256").update(message.trim()).digest("base64")

const generateCounts = (results: string[]): { [k: string]: number } => {
  const hashes = results.map(generateHash)

  return hashes.reduce((acc: { [k: string]: number }, hash: string) => {
    if (!acc[hash]) {
      acc[hash] = 0
    }
    acc[hash] += 1
    return acc
  }, {})
}

const main = async () => {
  const filename = process.argv[2]
  const localFileName = filename.startsWith("s3://")
    ? filename.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
    : filename

  const fileContents = fs.readFileSync(localFileName, { encoding: "utf-8" })
  const comparison = JSON.parse(fileContents) as ImportedComparison
  const iterations = process.argv[3] ? Number(process.argv[3]) : 20

  console.log(`Repeating ${iterations} times`)

  const mq = new ActiveMqHelper({
    url: process.env.MQ_URL || defaults.mqUrl,
    login: process.env.MQ_USER || defaults.mqUser,
    password: process.env.MQ_PASSWORD || defaults.mqPassword
  })

  // Clear the queue
  await mq.getMessages(queueName)

  const results: string[] = []
  for (let i = 0; i < iterations; i++) {
    await runFileOnBichard(comparison)
    let messages = []
    while (messages.length < 1) {
      messages = await mq.getMessages(queueName, 100)
      results.push(...messages)
      if (messages.length > 0) {
        const count = Object.keys(generateCounts(results)).length
        const countString = count > 1 ? chalk.red(count) : chalk.green(count)
        console.log(
          `results: ${chalk.yellow(
            results.length.toString().padStart(3, " ")
          )} iterations, ${countString} different results`
        )
      }
    }
  }

  await mq.disconnect()

  const counts = generateCounts(results)

  if (Object.keys(counts).length === 1) {
    console.log("Processing was consistent")
    process.exit(0)
  }

  if (Object.keys(counts).length === iterations) {
    console.log("All iterations were different - check the PNC connection")
    process.exit(1)
  }

  console.log(`${Object.keys(counts).length} different results were found`)
  Object.entries(counts).forEach(([hash, count]) => console.log(`${hash}: ${count}`))
  process.exit(1)
}

main()
