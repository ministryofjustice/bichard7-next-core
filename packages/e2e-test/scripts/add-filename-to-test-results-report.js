/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
const { XMLParser, XMLBuilder } = require("fast-xml-parser")
const fs = require("node:fs")
const path = require("node:path")
const glob = require("tiny-glob")

const reportFilename = path.join(__dirname, "..", "test-results", "results", "report.xml")
const data = fs.readFileSync(reportFilename, "utf8")

const featuresThatDoNotHaveFileNumbers = [
  "(Exception|Trigger|General) handler",
  "Supervisor",
  "Audit",
  "case list",
  "case details",
  "old bichard user"
]
const featuresThatDoNotHaveFileNumbersRegex = new RegExp(`${featuresThatDoNotHaveFileNumbers.join("|")}`, "i")
const featuresThatDoHaveFileNumbersRegex = /\d{3}[a-e]?/

async function addFilenameToTestResultsReport() {
  const featuresFiles = await glob("features/**/*.feature")

  const options = {
    attributeNamePrefix: "@",
    ignoreAttributes: false,
    cdataPropName: "__cdata"
  }

  const jsonXMLOject = new XMLParser(options).parse(data)

  if (jsonXMLOject.testsuite.testcase === undefined) {
    return
  }

  jsonXMLOject.testsuite.testcase.forEach((element) => {
    if (element["@file"]) {
      return
    }

    const className = element["@classname"]
    let featureName

    try {
      if (className.match(featuresThatDoNotHaveFileNumbersRegex)) {
        featureName = className.match(featuresThatDoNotHaveFileNumbersRegex)[0]
        featureName = `${featureName.toLowerCase().replaceAll(" ", "-")}.feature`
      } else {
        featureName = className.match(featuresThatDoHaveFileNumbersRegex)[0]
      }
    } catch (err) {
      console.error(`Error happened in: "${className}"`)
      throw err
    }

    element["@file"] = featuresFiles.find((featureFile) => featureFile.includes(featureName))
  })

  const xmlContent = new XMLBuilder(options).build(jsonXMLOject)

  fs.writeFileSync(reportFilename, xmlContent)
}

addFilenameToTestResultsReport()
