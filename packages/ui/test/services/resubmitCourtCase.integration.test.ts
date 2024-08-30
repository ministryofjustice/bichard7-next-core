import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertNotes from "services/insertNotes"
import sendToQueue from "services/mq/sendToQueue"
import resubmitCourtCase from "services/resubmitCourtCase"
import { DataSource } from "typeorm"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import offenceSequenceException from "../test-data/HO100302_1.json"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.mock("services/mq/sendToQueue")
jest.mock("services/insertNotes")

jest.setTimeout(60 * 60 * 1000)

describe("resubmit court case", () => {
  const userName = "GeneralHandler"
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
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
    await insertCourtCases(inputCourtCase)

    // check the queue hasn't been called
    expect(sendToQueue).toHaveBeenCalledTimes(0)

    const result = await resubmitCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase.errorId, {
      username: userName,
      visibleForces: ["01"],
      visibleCourts: [],
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    // pull out the case from the db
    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(sendToQueue).toHaveBeenCalledTimes(1)
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
    await insertCourtCases(inputCourtCase)

    // check the queue hasn't been called
    expect(sendToQueue).toHaveBeenCalledTimes(0)

    // parse the xml so we can assert on the values before they change
    const input = parseAhoXml(inputCourtCase.updatedHearingOutcome as string)

    expect(input).not.toBeInstanceOf(Error)

    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).not.toEqual(1234)

    const result = await resubmitCourtCase(
      dataSource,
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

    expect(sendToQueue).toHaveBeenCalledTimes(1)
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
    ).toEqual(1234)

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
    await insertCourtCases(inputCourtCase)

    // check the queue hasn't been called
    expect(sendToQueue).toHaveBeenCalledTimes(0)

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

    expect(sendToQueue).toHaveBeenCalledTimes(1)
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
})
