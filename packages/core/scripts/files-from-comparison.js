#!/usr/bin/env node

const fs = require("fs")
const { exec } = require("node:child_process")

const fileName = process.argv[2]
if (!fileName) {
  // eslint-disable-next-line no-console
  console.error("No file provided")
  process.exit()
}

const localFileName = fileName.startsWith("s3://")
  ? fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  : fileName

const fileText = fs.readFileSync(localFileName).toString()
const fileJson = JSON.parse(fileText)

const inputFileName = localFileName.replace(".json", ".input.xml")
const ahoFileName = localFileName.replace(".json", ".aho.xml")

fs.writeFileSync(inputFileName, fileJson.incomingMessage)
fs.writeFileSync(ahoFileName, fileJson.annotatedHearingOutcome)

exec(`code ${inputFileName}`)
exec(`code ${ahoFileName}`)
