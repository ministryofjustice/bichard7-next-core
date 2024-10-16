import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import fs from "fs"
import amendCourtCase from "services/amendCourtCase"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import type { DataSource } from "typeorm"
import createForceOwner from "utils/createForceOwner"
import getCourtCase from "../../src/services/getCourtCase"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases, insertCourtCasesWithFields } from "../utils/insertCourtCases"

jest.mock("services/getCourtCase")
jest.mock("services/updateCourtCaseAho")
jest.mock("@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml")
jest.mock("utils/createForceOwner")

jest.setTimeout(60 * 60 * 1000)

describe("amend court case", () => {
  const userName = "BichardForce01"
  const orgCode = "36FPA1"
  const user = {
    username: userName,
    visibleForces: [orgCode],
    visibleCourts: []
  } as Partial<User> as User
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Note)
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(getCourtCase as jest.Mock).mockImplementation(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementation(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseAho as jest.Mock).mockImplementation(jest.requireActual("services/updateCourtCaseAho").default)
    ;(createForceOwner as jest.Mock).mockImplementation(jest.requireActual("utils/createForceOwner").default)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should amend the court case", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.hearingOutcome).toMatchSnapshot()

    const result = await amendCourtCase(dataSource, {}, inputCourtCase, user)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
  })

  it("Should amend the court case when the lock is held by the current user", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "BichardForce01",
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.hearingOutcome).toMatchSnapshot()

    const result = await amendCourtCase(dataSource, {}, inputCourtCase, user)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
  })

  it("Should generate system notes for each each amendments", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(
      dataSource,
      {
        forceOwner: "03",
        courtOffenceSequenceNumber: [
          {
            offenceIndex: 0,
            value: 3333
          },
          {
            offenceIndex: 1,
            value: 1111
          }
        ]
      },
      inputCourtCase,
      user
    )

    expect(result).not.toBeInstanceOf(Error)

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.notes).toHaveLength(3)
    expect(retrievedCase?.notes[0].userId).toBe("System")
    expect(retrievedCase?.notes[0].noteText).toBe(
      `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: 03`
    )
    expect(retrievedCase?.notes[1].userId).toBe("System")
    expect(retrievedCase?.notes[1].noteText).toBe(
      `${userName}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 3333`
    )
    expect(retrievedCase?.notes[2].userId).toBe("System")
    expect(retrievedCase?.notes[2].noteText).toBe(
      `${userName}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 1111`
    )
  })

  it("Should not generate a system note when its a no update resubmit amendment", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase, user)

    expect(result).not.toBeInstanceOf(Error)

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.notes).toHaveLength(0)
  })

  it("Should not update the db if the error is locked by somebody else", async () => {
    const [errorLockedBySomeoneElse, triggerLockedBySomeoneElse] = await insertCourtCasesWithFields([
      {
        errorLockedByUsername: "BichardForce02",
        triggerLockedByUsername: user.username,
        errorCount: 1,
        triggerCount: 1,
        phase: 1,
        orgForPoliceFilter: orgCode,
        errorId: 0,
        hearingOutcome: "Dummy",
        updatedHearingOutcome: "Dummy"
      },
      {
        errorLockedByUsername: user.username,
        triggerLockedByUsername: "BichardForce02",
        errorCount: 1,
        triggerCount: 1,
        phase: 1,
        orgForPoliceFilter: orgCode,
        errorId: 1
      }
    ])

    const firstResult = await amendCourtCase(dataSource, { forceOwner: "04" }, triggerLockedBySomeoneElse, user)
    expect(firstResult).not.toBeInstanceOf(Error)

    const secondResult = await amendCourtCase(dataSource, { forceOwner: "04" }, errorLockedBySomeoneElse, user)
    expect(secondResult).toEqual(Error("Exception is locked by another user"))

    const caseWithErrorLock = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: errorLockedBySomeoneElse.errorId } })
    expect(caseWithErrorLock?.updatedHearingOutcome).toEqual(errorLockedBySomeoneElse.updatedHearingOutcome)
  })

  it("Should create a force owner if the force owner is not present", async () => {
    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: inputXml,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase, user)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(updateCourtCaseAho).toHaveBeenCalledTimes(1)
    expect(createForceOwner).toHaveBeenCalledWith(inputCourtCase.orgForPoliceFilter)
    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()
  })

  it("Should return an error if the xml is invalid", async () => {
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(() => new Error("Failed to parse aho"))

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase, user)
    expect(result).toEqual(Error("Failed to parse aho"))
  })

  it("Should return an error if it cannot update the db", async () => {
    ;(updateCourtCaseAho as jest.Mock).mockImplementationOnce(() => new Error("Failed to update the database"))

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase, user)

    expect(result).toEqual(Error("Failed to update the database"))
  })

  it("Should return an error if the force owner organistaion unit codes are invalid", async () => {
    ;(createForceOwner as jest.Mock).mockImplementationOnce(() => new Error("Failed to create organistaion unit codes"))

    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: inputXml,
      orgForPoliceFilter: orgCode
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase, user)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(result).toEqual(Error("Failed to create organistaion unit codes"))
  })
})
