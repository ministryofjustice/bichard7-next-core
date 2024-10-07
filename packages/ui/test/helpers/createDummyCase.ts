import { faker } from "@faker-js/faker"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import serialiseToXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/serialise/ahoXml/serialiseToXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { subYears } from "date-fns"
import sample from "lodash.sample"
import Trigger from "services/entities/Trigger"
import { DataSource, EntityManager } from "typeorm"
import { v4 as uuidv4 } from "uuid"
import CourtCase from "../../src/services/entities/CourtCase"
import { Result, isError } from "../../src/types/Result"
import createDummyAsn from "./createDummyAsn"
import createDummyCourtCode from "./createDummyCourtCode"
import createDummyExceptions from "./createDummyExceptions"
import createDummyNotes from "./createDummyNotes"
import createDummyPtiurn from "./createDummyPtiurn"
import createDummyTriggers from "./createDummyTriggers"
import randomDate from "./createRandomDate"
import generateAho from "./generateAho"

const randomBoolean = (): boolean => sample([true, false]) ?? true

const randomUsername = (): string =>
  `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}`.slice(0, 31)

const randomName = (): string => `${faker.person.lastName().toUpperCase()} ${faker.person.firstName()}`.slice(0, 31)

export default async (
  dataSource: DataSource | EntityManager,
  caseId: number,
  orgCode: string,
  ahoTemplate: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<CourtCase> => {
  const firstName = `${faker.person.firstName().toUpperCase()}`
  const lastName = `${faker.person.lastName().toUpperCase()}`
  const courtName = faker.location.city()

  const caseDate = randomDate(dateFrom || subYears(new Date(), 1), dateTo || new Date())
  const ptiurn = createDummyPtiurn(caseDate.getFullYear(), orgCode + faker.string.alpha(2).toUpperCase())
  const isResolved = randomBoolean()
  const resolutionDate = isResolved ? randomDate(caseDate, dateTo || new Date()) : null

  let triggers: Trigger[]
  let triggersExist: boolean
  const magicNumberForIncludingEmptyTriggers = 25
  if (caseId % magicNumberForIncludingEmptyTriggers === 0) {
    triggers = []
    triggersExist = false
  } else {
    triggers = createDummyTriggers(dataSource, caseId, caseDate, dateTo || new Date(), isResolved)
    triggersExist = true
  }
  const hasUnresolvedTriggers = triggers.filter((trigger) => trigger.status === "Unresolved").length > 0

  const randomisedAho = generateAho({ firstName, lastName, courtName, ptiurn, ahoTemplate })

  const parsedAho: Result<AnnotatedHearingOutcome> = parseAhoXml(randomisedAho)

  if (isError(parsedAho)) {
    console.log("Missing or invalid AHO")
    throw parsedAho
  }

  const notes = createDummyNotes(dataSource, caseId, triggers, isResolved)
  const { errorReport, errorReason, exceptionCount, ahoWithExceptions } = createDummyExceptions(
    hasUnresolvedTriggers,
    parsedAho
  )
  const hasExceptions = exceptionCount > 0

  let ahoWithExceptionsXml

  if (ahoWithExceptions) {
    ahoWithExceptionsXml = serialiseToXml(ahoWithExceptions)
  }

  const courtCase = await dataSource.getRepository(CourtCase).save({
    errorId: caseId,
    messageId: uuidv4(),
    orgForPoliceFilter: orgCode,
    errorLockedByUsername: !isResolved && hasExceptions && randomBoolean() ? randomUsername() : null,
    triggerLockedByUsername:
      !isResolved && hasUnresolvedTriggers && randomBoolean() && triggersExist ? randomUsername() : null,
    phase: 1,
    errorStatus: exceptionCount === 0 ? null : !isResolved && hasExceptions ? "Unresolved" : "Resolved",
    triggerStatus: triggers.length === 0 ? null : hasUnresolvedTriggers ? "Unresolved" : "Resolved",
    errorQualityChecked: 1,
    triggerQualityChecked: 1,
    triggerCount: triggers.length,
    isUrgent: randomBoolean(),
    asn: createDummyAsn(caseDate.getFullYear(), orgCode + faker.string.alpha(2).toUpperCase()),
    courtCode: createDummyCourtCode(orgCode),
    hearingOutcome: errorReport
      ? ahoWithExceptionsXml
      : generateAho({ firstName, lastName, courtName, ptiurn, ahoTemplate }),
    errorReport: errorReport,
    createdTimestamp: caseDate,
    errorReason: errorReason,
    triggerReason: triggers.length > 0 ? triggers[0].triggerCode : null,
    errorCount: exceptionCount,
    userUpdatedFlag: randomBoolean() ? 1 : 0,
    courtDate: caseDate,
    ptiurn: ptiurn,
    courtName: courtName,
    messageReceivedTimestamp: caseDate,
    defendantName: `${firstName} ${lastName}`,
    courtRoom: Math.round(Math.random() * 15)
      .toString()
      .padStart(2, "0"),
    courtReference: ptiurn,
    errorInsertedTimestamp: caseDate,
    triggerInsertedTimestamp: caseDate,
    pncUpdateEnabled: "Y",
    notes: notes,
    triggers: triggers,
    resolutionTimestamp: resolutionDate,
    errorResolvedBy: isResolved ? randomName() : null,
    triggerResolvedBy: (isResolved && triggersExist) || (triggersExist && !hasUnresolvedTriggers) ? randomName() : null,
    triggerResolvedTimestamp:
      (isResolved && triggersExist) || (triggersExist && !hasUnresolvedTriggers) ? new Date() : null,
    errorResolvedTimestamp: isResolved ? resolutionDate : null
  })

  return courtCase
}
