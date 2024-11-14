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

async function addFileToFeatureReport() {
  const features = await glob("features/**/*.feature")

  const options = {
    attributeNamePrefix: "@",
    ignoreAttributes: false,
    cdataPropName: "__cdata"
  }

  const parser = new XMLParser(options)
  const jObj = parser.parse(data)

  if (jObj.testsuite.testcase === undefined) {
    return
  }

  jObj.testsuite.testcase.forEach((element) => {
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
      console.error(`Error happned in: "${className}"`)
      throw err
    }

    const file = features.find((feature) => feature.includes(featureName))

    element["@file"] = file
  })

  const builder = new XMLBuilder(options)
  const xmlContent = builder.build(jObj)

  fs.writeFileSync(reportFilename, xmlContent)
}

addFileToFeatureReport()
