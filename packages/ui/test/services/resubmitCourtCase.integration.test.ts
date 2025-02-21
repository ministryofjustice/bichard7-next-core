import EventCode from "@moj-bichard7/common/types/EventCode"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { AUDIT_LOG_EVENT_SOURCE } from "config"
import CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertNotes from "services/insertNotes"
import type MqGateway from "services/mq/types/MqGateway"
import resubmitCourtCase from "services/resubmitCourtCase"
import type { DataSource } from "typeorm"
import fetchAuditLogEvents from "../helpers/fetchAuditLogEvents"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import offenceSequenceException from "../test-data/HO100302_1.json"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCasesWithFields } from "../utils/insertCourtCases"

jest.mock("services/insertNotes")

jest.setTimeout(60 * 60 * 1000)

describe("resubmit court case", () => {
  const mockMqGateway = { execute: jest.fn() } as unknown as MqGateway
  const userName = "GeneralHandler"
  let dataSource: DataSource

  const resubmissionEvent = (eventCode: string, eventType: string, userName = "ExceptionHandler") => {
    return {
      attributes: {
        auditLogVersion: 2
      },
      category: "information",
      eventCode,
      eventSource: AUDIT_LOG_EVENT_SOURCE,
      eventType,
      timestamp: expect.anything(),
      user: userName
    }
  }

  const exceptionUnlockedEvent = {
    attributes: { auditLogVersion: 2 },
    category: "information",
    eventCode: "exceptions.unlocked",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Exception unlocked",
    timestamp: expect.anything(),
    user: "GeneralHandler"
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should resubmit a court case with no updates", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: userName,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "01"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    // check the queue hasn't been called
    expect(mockMqGateway.execute).toHaveBeenCalledTimes(0)

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { noUpdatesResubmit: true },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["01"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    // pull out the case from the db
    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(mockMqGateway.execute).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(2)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      {
        errorId: inputCourtCase.errorId,
        noteText: "GeneralHandler: Portal Action: Resubmitted Message.",
        userId: "System"
      }
    ])

    // assert that the xml in the db is as we expect
    expect(retrievedCase?.updatedHearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })

  it("Should resubmit a court case with updates to Court Offence Sequence Number", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    // check the queue hasn't been called
    expect(mockMqGateway.execute).toHaveBeenCalledTimes(0)

    // parse the xml so we can assert on the values before they change
    const input = parseAhoXml(inputCourtCase.updatedHearingOutcome as string)

    expect(input).not.toBeInstanceOf(Error)

    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).not.toBe(1234)

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { courtOffenceSequenceNumber: [{ offenceIndex: 0, value: 1234 }] },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    // pull out the case from the db
    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(mockMqGateway.execute).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(2)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      {
        errorId: inputCourtCase.errorId,
        noteText: "GeneralHandler: Portal Action: Resubmitted Message.",
        userId: "System"
      }
    ])

    // parse the retreived case to aho format so we can assert on the values
    const parsedCase = parseAhoXml((retrievedCase as CourtCase).updatedHearingOutcome as string)

    expect(parsedCase).not.toBeInstanceOf(Error)

    expect(
      (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).toBe(1234)

    // assert that the xml in the db is as we expect
    expect(retrievedCase?.updatedHearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })

  it("Should resubmit a court case with updates to multiple offences", async () => {
    const amendments = [
      { offenceIndex: 0, value: 1234 },
      { offenceIndex: 1, value: 1234 }
    ]

    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    // check the queue hasn't been called
    expect(mockMqGateway.execute).toHaveBeenCalledTimes(0)

    // parse the xml so we can assert on the values before they change
    const input = parseAhoXml(inputCourtCase.updatedHearingOutcome as string)

    expect(input).not.toBeInstanceOf(Error)

    amendments.forEach(({ offenceIndex, value }) => {
      expect(
        (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
          offenceIndex
        ].CourtOffenceSequenceNumber
      ).not.toEqual(value)
    })

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      {
        courtOffenceSequenceNumber: amendments
      },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    // pull out the case from the db
    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(mockMqGateway.execute).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(2)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      {
        errorId: inputCourtCase.errorId,
        noteText: "GeneralHandler: Portal Action: Resubmitted Message.",
        userId: "System"
      }
    ])

    // parse the retreived case to aho format so we can assert on the values
    const parsedCase = parseAhoXml((retrievedCase as CourtCase).updatedHearingOutcome as string)

    expect(parsedCase).not.toBeInstanceOf(Error)

    amendments.forEach(({ offenceIndex, value }) => {
      expect(
        (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
          offenceIndex
        ].CourtOffenceSequenceNumber
      ).toEqual(value)
      expect(
        (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
          offenceIndex
        ].CourtOffenceSequenceNumber
      ).toEqual(value)
    })

    // assert that the xml in the db is as we expect
    expect(retrievedCase?.updatedHearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })

  it("Should log Hearing outcome resubmission to phase 1", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { courtOffenceSequenceNumber: [{ offenceIndex: 0, value: 1234 }] },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )
    const events = await fetchAuditLogEvents(inputCourtCase.messageId)

    expect(result).not.toBeInstanceOf(Error)
    expect(events).toHaveLength(2)
    expect(events).toContainEqual(
      resubmissionEvent(EventCode.HearingOutcomeResubmittedPhase1, "Hearing outcome resubmitted to phase 1", userName)
    )
    expect(events).toContainEqual(exceptionUnlockedEvent)
  })

  it("Should log Hearing outcome resubmission to phase 2", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 2,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { courtOffenceSequenceNumber: [{ offenceIndex: 0, value: 1234 }] },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )
    const events = await fetchAuditLogEvents(inputCourtCase.messageId)

    expect(result).not.toBeInstanceOf(Error)
    expect(events).toHaveLength(2)
    expect(events).toContainEqual(
      resubmissionEvent(EventCode.HearingOutcomeResubmittedPhase2, "Hearing outcome resubmitted to phase 2", userName)
    )
    expect(events).toContainEqual(exceptionUnlockedEvent)
  })

  it("should send generatedXml to phase 1 queue", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { courtOffenceSequenceNumber: [{ offenceIndex: 0, value: 1234 }] },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )

    expect(result).not.toBeInstanceOf(Error)

    expect(mockMqGateway.execute).toHaveBeenCalledTimes(1)
    const [messageXml, queueName] = (mockMqGateway.execute as jest.Mock).mock.calls[0]
    expect(queueName).toBe("PHASE_1_RESUBMIT_QUEUE")
    expect(messageXml).toMatchSnapshot()
  })

  it("should send generatedXml to phase 2 queue", async () => {
    // set up court case in the right format to insert into the db
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: userName,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 2,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml,
      orgForPoliceFilter: "1111"
    })

    // insert the record to the db
    await insertCourtCasesWithFields([inputCourtCase])

    const result = await resubmitCourtCase(
      dataSource,
      mockMqGateway,
      { courtOffenceSequenceNumber: [{ offenceIndex: 0, value: 1234 }] },
      inputCourtCase.errorId,
      {
        username: userName,
        visibleForces: ["11"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User
    )

    expect(result).not.toBeInstanceOf(Error)

    expect(mockMqGateway.execute).toHaveBeenCalledTimes(1)
    const [messageXml, queueName] = (mockMqGateway.execute as jest.Mock).mock.calls[0]
    expect(queueName).toBe("PHASE_2_RESUBMIT_QUEUE")
    expect(messageXml).toMatchSnapshot()
  })
})
