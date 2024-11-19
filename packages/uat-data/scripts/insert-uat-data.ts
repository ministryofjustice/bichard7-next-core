import { fakerEN_GB as faker } from "@faker-js/faker"
import IncomingMessageBucket from "@moj-bichard7/e2e-tests/helpers/IncomingMessageBucket"
import MockPNCHelper from "@moj-bichard7/e2e-tests/helpers/MockPNCHelper"
import ASN from "@moj-bichard7/e2e-tests/utils/asn"
import defaults from "@moj-bichard7/e2e-tests/utils/defaults"
import { mockUpdate } from "@moj-bichard7/e2e-tests/utils/pncMocks"
import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import { randomUUID } from "crypto"
import fs from "fs"

// Process:
// - find a record in the DB that matches your criteria (e.g. specific trigger)
// - Extract the AHO from the db and pull out the PNC data
// - Convert the PNC data into a PNC response
// - Look up the S3 path in Dynamo
// - Grab the original incoming message
// - Anonymise it and make the PNC message match

const { DEPLOY_NAME, REPEAT_SCENARIOS = 1 } = process.env

if (DEPLOY_NAME !== "uat") {
  console.error("Not running in uat environment, bailing out. Set DEPLOY_NAME='uat' if you're sure.")
  process.exit(1)
}

const pnc = new MockPNCHelper({
  host: process.env.PNC_HOST || defaults.pncHost,
  port: Number(process.env.PNC_PORT || defaults.pncPort)
})

const incomingMessageBucket = new IncomingMessageBucket({
  incomingMessageBucketName: process.env.S3_INCOMING_MESSAGE_BUCKET || defaults.incomingMessageBucket,
  region: process.env.S3_REGION || defaults.awsRegion,
  url: process.env.AWS_URL ?? ""
})

const SCENARIO_PATH = "./data/"

const scenarios = fs
  .readdirSync(SCENARIO_PATH)
  .filter((scenario) => scenario !== "README.md" && !scenario.startsWith("."))

console.log(`Seeding bichard with ${scenarios.length * Number(REPEAT_SCENARIOS)} cases`)

const mockUpdateCodes = ["CXU01", "CXU02", "CXU03", "CXU04", "CXU05", "CXU06", "CXU07"]

const magistrateCourts = organisationUnit.filter((unit) => unit.topLevelCode === "B" && unit.secondLevelCode === "01")

let asnCounter = 100000

const seedScenario = async (scenario: string) => {
  const court = magistrateCourts[Math.floor(Math.random() * magistrateCourts.length)]
  const courtCode = `${court.topLevelCode}${court.secondLevelCode}${court.thirdLevelCode}${court.bottomLevelCode}`
  asnCounter += 1
  const asn = new ASN(`2100000000000${asnCounter.toString().padStart(6, "0")}`).toString()
  const ptiurn = `01XX${faker.string.numeric({ length: 7 })}`
  const givenName = faker.person.firstName().toUpperCase()
  const familyName = faker.person.lastName().toUpperCase()

  const offenceLocation =
    `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`.slice(0, 80)

  const pncData = fs
    .readFileSync(`${SCENARIO_PATH}${scenario}/pnc-data.xml`)
    .toString()
    .replace(/FAMILY_NAME/g, familyName.padEnd(24, " "))

  await pnc.addMock(`CXE01.*${asn.slice(-7)}`, pncData)

  const incomingMessage = fs
    .readFileSync(`${SCENARIO_PATH}${scenario}/incoming-message.xml`)
    .toString()
    .replace(/EXTERNAL_CORRELATION_ID/g, randomUUID())
    .replace(/COURT_LOCATION/g, courtCode)
    .replace(/PROSECUTOR_REFERENCE/g, asn)
    .replace(/PNC_IDENTIFIER/g, "20230012345P")
    .replace(/_PTIURN_/g, ptiurn)
    .replace(/GIVEN_NAME/g, givenName)
    .replace(/FAMILY_NAME/g, familyName)
    .replace(/DATE_OF_BIRTH/g, "1983-03-11")
    .replace(/ADDRESS_LINE_1/g, faker.location.streetAddress().toUpperCase())
    .replace(/ADDRESS_LINE_2/g, faker.location.street().toUpperCase())
    .replace(/ADDRESS_LINE_3/g, faker.location.city().toUpperCase())
    .replace(/ADDRESS_LINE_4/g, faker.location.county().toUpperCase())
    .replace(/ADDRESS_LINE_5/g, faker.location.zipCode().toUpperCase())
    .replace(/OFFENCE_LOCATION/g, offenceLocation)
    .replace(/DATE_OF_HEARING/g, new Date().toISOString().split("T")[0])
    .replace(/VICTIM_\d+/g, faker.person.fullName().toUpperCase())
    .replace(/SUP3R F8ST/, faker.vehicle.vrm())

  const s3Path = await incomingMessageBucket.upload(incomingMessage, randomUUID())
  console.log({
    asn,
    ptiurn,
    s3Path,
    scenario
  })
}

const updatePncEmulator = async () => {
  await pnc.clearMocks()

  await Promise.all(
    mockUpdateCodes.map((code) => {
      const updateData = mockUpdate(code)
      return pnc.addMock(updateData.matchRegex, updateData.response)
    })
  )
}

;(async () => {
  await updatePncEmulator()

  for (let i = 0; i < Number(REPEAT_SCENARIOS); i += 1) {
    console.log(`seeding batch ${i + 1}`)
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(scenarios.map(seedScenario))
  }
})()
