#!/usr/bin/env node

const fs = require("fs")
const { exec } = require("node:child_process")

const fileName = process.argv[2]
if (!fileName) {
  console.error("No file provided")
  process.exit()
}

const localFileName = fileName.startsWith("s3://")
  ? fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  : fileName

const fileText = fs.readFileSync(localFileName).toString()
const fileJson = JSON.parse(fileText)

const inputType = {
  1: "spi-or-aho",
  2: "aho",
  3: "pnc-update-dataset"
}[fileJson.phase]

const outputType = {
  1: "aho",
  2: "pnc-update-dataset",
  3: "pnc-update-dataset"
}[fileJson.phase]

const inputFileName = localFileName.replace(".json", `.${inputType}-input.xml`)
const ahoFileName = localFileName.replace(".json", `.${outputType}-output.xml`)

fs.writeFileSync(inputFileName, fileJson.incomingMessage)
exec(`code ${inputFileName}`)

if (fileJson.annotatedHearingOutcome || fileJson.outgoingMessage) {
  fs.writeFileSync(ahoFileName, fileJson.annotatedHearingOutcome || fileJson.outgoingMessage)
  exec(`code ${ahoFileName}`)
}
