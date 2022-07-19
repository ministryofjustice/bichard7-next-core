import crypto from "crypto"
import fs from "fs"
import ActiveMqHelper from "tests/helpers/ActiveMqHelper"
import defaults from "tests/helpers/defaults"
import runFileOnBichard from "./runFileOnBichard"
import type { ImportedComparison } from "./Types/ImportedComparison"

const queueName = "PROCESSING_VALIDATION_QUEUE"

const generateHash = (message: string): string => crypto.createHash("sha256").update(message.trim()).digest("base64")

const main = async () => {
  const filename = process.argv[2]
  const fileContents = fs.readFileSync(filename, { encoding: "utf-8" })
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
        console.log("results: ", results.length)
      }
    }
  }

  await mq.disconnect()

  const hashes = results.map(generateHash)

  const counts = hashes.reduce((acc: { [k: string]: number }, hash: string) => {
    if (!acc[hash]) {
      acc[hash] = 0
    }
    acc[hash] += 1
    return acc
  }, {})

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
