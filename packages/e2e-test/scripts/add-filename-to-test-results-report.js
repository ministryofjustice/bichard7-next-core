/* eslint-disable no-param-reassign */
const { XMLParser, XMLBuilder } = require("fast-xml-parser")
const fs = require("node:fs")
const path = require("node:path")
const glob = require("tiny-glob")

const reportFilename = path.join(__dirname, "..", "test-results", "results", "report.xml")
const data = fs.readFileSync(reportFilename, "utf8")

async function addFileToFeatureReport() {
  const features = await glob("features/**/*.feature")

  const options = {
    attributeNamePrefix: "@",
    ignoreAttributes: false,
    cdataPropName: "__cdata"
  }

  const parser = new XMLParser(options)
  const jObj = parser.parse(data)

  jObj.testsuite.testcase.forEach((element) => {
    if (element["@file"]) {
      return
    }

    const regex = /(\d{3}|(Exception|Trigger|General) handler|Supervisor|Audit)/i

    let featureName = element["@classname"].match(regex)[0]

    if (!/\d{3}/.test(featureName)) {
      featureName = `${featureName.toLowerCase().replaceAll(" ", "-")}.feature`
    }

    const file = features.find((feature) => feature.includes(featureName))

    element["@file"] = file
  })

  const builder = new XMLBuilder(options)
  const xmlContent = builder.build(jObj)

  fs.writeFileSync(reportFilename, xmlContent)
}

addFileToFeatureReport()
