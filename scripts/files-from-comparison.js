#!/usr/bin/env node

const fs = require("fs")
const { exec } = require("node:child_process")

const fileName = process.argv[2]
if (!fileName) {
  console.error("No file provided")
  process.exit()
}

const fileText = fs.readFileSync(fileName).toString()
const fileJson = JSON.parse(fileText)

const inputFileName = fileName.replace(".json", ".input.xml")
const ahoFileName = fileName.replace(".json", ".aho.xml")

fs.writeFileSync(inputFileName, fileJson.incomingMessage)
fs.writeFileSync(ahoFileName, fileJson.annotatedHearingOutcome)

exec(`code ${inputFileName}`)
exec(`code ${ahoFileName}`)
