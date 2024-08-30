import generateTriggers from "@moj-bichard7-developers/bichard7-next-core/core/lib/triggers/generateTriggers"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import Note from "services/entities/Note"
import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import insertNotes from "services/insertNotes"
import reallocateCourtCaseToForce from "services/reallocateCourtCase/reallocateCourtCaseToForce"
import { DataSource, UpdateQueryBuilder } from "typeorm"
import { AUDIT_LOG_EVENT_SOURCE, REALLOCATE_CASE_TRIGGER_CODE } from "../../../src/config"
import amendCourtCase from "../../../src/services/amendCourtCase"
import CourtCase from "../../../src/services/entities/CourtCase"
import getDataSource from "../../../src/services/getDataSource"
import recalculateTriggers from "../../../src/services/reallocateCourtCase/recalculateTriggers"
import updateCourtCase from "../../../src/services/reallocateCourtCase/updateCourtCase"
import updateTriggers from "../../../src/services/reallocateCourtCase/updateTriggers"
import { isError } from "../../../src/types/Result"
import fetchAuditLogEvents from "../../helpers/fetchAuditLogEvents"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromDynamoTable from "../../utils/deleteFromDynamoTable"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"

jest.mock("services/insertNotes")
jest.mock("services/reallocateCourtCase/recalculateTriggers")
jest.mock("services/reallocateCourtCase/updateTriggers")
jest.mock("services/reallocateCourtCase/updateCourtCase")
jest.mock("services/amendCourtCase")
jest.mock("@moj-bichard7-developers/bichard7-next-core/core/lib/triggers/generateTriggers")

const createUnlockedEvent = (unlockReason: "Trigger" | "Exception", userName: string) => {
  return {
    attributes: { auditLogVersion: 2 },
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: `${unlockReason} unlocked`,
    timestamp: expect.anything(),
    eventCode: `${unlockReason.toLowerCase()}s.unlocked`,
    user: userName
  }
}

const createReallocationEvent = (newForceOwner: string, userName: string) => {
  return {
    attributes: {
      auditLogVersion: 2,
      "New Force Owner": newForceOwner
    },
    eventCode: "hearing-outcome.reallocated",
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Hearing outcome reallocated by user",
    timestamp: expect.anything(),
    user: userName
  }
}

const createTriggersGeneratedEvent = (triggers: string[], hasUnresolvedExceptions: boolean, userName: string) => {
  const triggersDetails = triggers.reduce((acc: Record<string, unknown>, triggerCode, index) => {
    acc[`Trigger ${index + 1} Details`] = triggerCode
    return acc
  }, {})

  return {
    attributes: {
      auditLogVersion: 2,
      "Trigger and Exception Flag": hasUnresolvedExceptions,
      "Number of Triggers": triggers.length,
      ...triggersDetails
    },
    eventCode: "triggers.generated",
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Triggers generated",
    timestamp: expect.anything(),
    user: userName
  }
}

describe("reallocate court case to another force", () => {
  const courtCaseId = 1
  const oldForceCode = "01"
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Note)
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(SurveyFeedback)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(insertNotes as jest.Mock).mockImplementation(jest.requireActual("services/insertNotes").default)
    ;(recalculateTriggers as jest.Mock).mockImplementation(
      jest.requireActual("services/reallocateCourtCase/recalculateTriggers").default
    )
    ;(updateTriggers as jest.Mock).mockImplementation(
      jest.requireActual("services/reallocateCourtCase/updateTriggers").default
    )
    ;(updateCourtCase as jest.Mock).mockImplementation(
      jest.requireActual("services/reallocateCourtCase/updateCourtCase").default
    )
    ;(amendCourtCase as jest.Mock).mockImplementation(jest.requireActual("services/amendCourtCase").default)
    ;(generateTriggers as jest.Mock).mockImplementation(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/core/lib/triggers/generateTriggers").default
    )
  }, 20_000)

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a user can see the case", () => {
    it("Should reallocate the case to a new force, generate system notes and unlock the case", async () => {
      const newForceCode = "04"
      const expectedForceOwner = `${newForceCode}YZ00`
      const userName = "GeneralHandler"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: userName,
          triggerLockedByUsername: userName
        }
      ])

      const user = {
        username: userName,
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, newForceCode)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual("04YZ  ")
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const parsedUpdatedHearingOutcome = parseAhoXml(actualCourtCase.updatedHearingOutcome as string)
      expect(parsedUpdatedHearingOutcome).not.toBeInstanceOf(Error)

      const parsedCase = (parsedUpdatedHearingOutcome as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome
        .Case

      expect(parsedCase.ForceOwner?.OrganisationUnitCode).toEqual(expectedForceOwner)
      expect(parsedCase.ForceOwner?.BottomLevelCode).toEqual("00")
      expect(parsedCase.ForceOwner?.SecondLevelCode).toEqual(newForceCode)
      expect(parsedCase.ForceOwner?.ThirdLevelCode).toEqual("YZ")
      expect(parsedCase.ManualForceOwner).toBe(true)
      expect(actualCourtCase.notes).toHaveLength(2)

      expect(actualCourtCase.notes[0].userId).toEqual("System")
      expect(actualCourtCase.notes[0].noteText).toEqual(
        `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: ${newForceCode}`
      )
      expect(actualCourtCase.notes[1].userId).toEqual("System")
      expect(actualCourtCase.notes[1].noteText).toEqual(
        `${userName}: Case reallocated to new force owner: ${expectedForceOwner}`
      )

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(4)
      expect(events).toContainEqual(createReallocationEvent(expectedForceOwner, user.username))
      expect(events).toContainEqual(createUnlockedEvent("Exception", user.username))
      expect(events).toContainEqual(createUnlockedEvent("Trigger", user.username))
      expect(events).toContainEqual(
        createTriggersGeneratedEvent(
          [TriggerCode.TRPR0003, TriggerCode.TRPR0004, TriggerCode.TRPR0004, TriggerCode.TRPR0010],
          true,
          user.username
        )
      )
    })

    it("Should reallocate the case to a new force, generate system notes, user note, and unlock the case", async () => {
      const newForceCode = "04"
      const expectedForceOwner = `${newForceCode}YZ00`
      const userName = "GeneralHandler"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: userName,
          triggerLockedByUsername: userName
        }
      ])

      const user = {
        username: userName,
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(
        dataSource,
        courtCaseId,
        user,
        newForceCode,
        "GeneralHandler note"
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual("04YZ  ")
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const parsedUpdatedHearingOutcome = parseAhoXml(actualCourtCase.updatedHearingOutcome as string)
      expect(parsedUpdatedHearingOutcome).not.toBeInstanceOf(Error)

      const parsedCase = (parsedUpdatedHearingOutcome as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome
        .Case

      expect(parsedCase.ForceOwner?.OrganisationUnitCode).toEqual(expectedForceOwner)
      expect(parsedCase.ForceOwner?.BottomLevelCode).toEqual("00")
      expect(parsedCase.ForceOwner?.SecondLevelCode).toEqual(newForceCode)
      expect(parsedCase.ForceOwner?.ThirdLevelCode).toEqual("YZ")
      expect(parsedCase.ManualForceOwner).toBe(true)
      expect(actualCourtCase.notes).toHaveLength(3)
      const notes = actualCourtCase.notes.sort((noteA, noteB) => (noteA.noteId > noteB.noteId ? 1 : -1))

      expect(notes[0].userId).toEqual("System")
      expect(notes[0].noteText).toEqual(
        `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: ${newForceCode}`
      )
      expect(notes[1].userId).toEqual("System")
      expect(notes[1].noteText).toEqual(`${userName}: Case reallocated to new force owner: ${expectedForceOwner}`)

      expect(notes[2].userId).toEqual(userName)
      expect(notes[2].noteText).toEqual("GeneralHandler note")

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(4)
      expect(events).toContainEqual(createReallocationEvent(expectedForceOwner, user.username))
      expect(events).toContainEqual(createUnlockedEvent("Exception", user.username))
      expect(events).toContainEqual(createUnlockedEvent("Trigger", user.username))
      expect(events).toContainEqual(
        createTriggersGeneratedEvent(
          [TriggerCode.TRPR0003, TriggerCode.TRPR0004, TriggerCode.TRPR0004, TriggerCode.TRPR0010],
          true,
          user.username
        )
      )
    })
  })

  it("Should call functions in order", async () => {
    const newForceCode = "04"
    const userName = "GeneralHandler"
    await insertCourtCasesWithFields([
      {
        orgForPoliceFilter: oldForceCode,
        errorId: courtCaseId,
        errorLockedByUsername: null,
        triggerLockedByUsername: userName,
        errorStatus: "Resolved"
      }
    ])

    const user = {
      username: userName,
      visibleForces: [oldForceCode],
      visibleCourts: [],
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User

    const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, newForceCode)
    expect(isError(result)).toBe(false)

    expect(generateTriggers).toHaveBeenCalledTimes(1)
    expect(recalculateTriggers).toHaveBeenCalledTimes(1)
    expect(updateTriggers).toHaveBeenCalledTimes(1)
    expect(amendCourtCase).toHaveBeenCalledTimes(1)
    expect(updateCourtCase).toHaveBeenCalledTimes(1)
    const functionCallOrders = [
      generateTriggers,
      recalculateTriggers,
      updateTriggers,
      amendCourtCase,
      updateCourtCase
    ].map((fn: any) => fn.mock.invocationCallOrder.slice(-1)[0])
    expect(functionCallOrders).toStrictEqual([...functionCallOrders].sort((a, b) => (a > b ? 1 : -1)))
  })

  it("Should not add reallocation trigger (TRPR0028) when case has unresolved exceptions", async () => {
    const newForceCode = "04"
    const userName = "GeneralHandler"
    await insertCourtCasesWithFields([
      {
        orgForPoliceFilter: oldForceCode,
        errorId: courtCaseId,
        errorLockedByUsername: null,
        triggerLockedByUsername: userName,
        errorStatus: "Unresolved"
      }
    ])

    const user = {
      username: userName,
      visibleForces: [oldForceCode],
      visibleCourts: [],
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User

    const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, newForceCode)
    expect(isError(result)).toBe(false)

    expect(recalculateTriggers).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.not.arrayContaining([{ code: REALLOCATE_CASE_TRIGGER_CODE }])
    )
  })

  describe("when the case is not visible to the user", () => {
    it("Should return an error and not perform any of reallocation steps", async () => {
      const anotherOrgCode = "02XX  "

      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: anotherOrgCode,
          errorId: courtCaseId
        }
      ])

      const user = {
        username: "GeneralHandler",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Failed to reallocate: Case not found`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(anotherOrgCode)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })

  describe("when the case is locked by another user", () => {
    it("Should return an error and not perform any of reallocation steps", async () => {
      const anotherUser = "BichardForce02"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: anotherUser,
          triggerLockedByUsername: anotherUser
        }
      ])

      const user = {
        username: "GeneralHandler",
        visibleForces: [oldForceCode],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Exception is locked by another user`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toStrictEqual(anotherUser)
      expect(actualCourtCase.triggerLockedByUsername).toStrictEqual(anotherUser)
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })

  describe("when there is an unexpected error", () => {
    const user = {
      username: "GeneralHandler",
      visibleForces: [oldForceCode],
      visibleCourts: [],
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User

    it("should return error when case is recordable, in PNC update phase, and exceptions are resolved", async () => {
      await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          phase: Phase.PNC_UPDATE,
          errorStatus: "Resolved",
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username
        }
      ])

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error("Logic to generate post update triggers is not implemented"))
    })

    it("should return error when case is recordable, in PNC update phase, and there are no exceptions", async () => {
      await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          phase: Phase.PNC_UPDATE,
          errorStatus: null,
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username
        }
      ])

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error("Logic to generate post update triggers is not implemented"))
    })

    it("Should return error if fails to update triggers", async () => {
      await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username
        }
      ])
      ;(updateTriggers as jest.Mock).mockImplementationOnce(() => new Error("Error while updating triggers"))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error("Error while updating triggers"))
    })

    it("Should return the error if fails to amend court case", async () => {
      await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username
        }
      ])
      ;(amendCourtCase as jest.Mock).mockImplementationOnce(() => new Error("Error while amending court case"))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error("Error while amending court case"))
    })

    it("Should return error if fails to update court case", async () => {
      await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId,
          errorLockedByUsername: user.username,
          triggerLockedByUsername: user.username
        }
      ])
      ;(updateCourtCase as jest.Mock).mockImplementationOnce(() => new Error("Error while update court case"))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error("Error while update court case"))
    })

    it("Should return the error if fails to create notes", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId
        }
      ])

      ;(insertNotes as jest.Mock).mockImplementationOnce(() => new Error(`Error while creating notes`))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Error while creating notes`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })

    it("Should return error when fails to update orgForPoliceFilter", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          orgForPoliceFilter: oldForceCode,
          errorId: courtCaseId
        }
      ])

      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const result = await reallocateCourtCaseToForce(dataSource, courtCaseId, user, "06").catch((error) => error)
      expect(result).toEqual(Error(`Failed to update record with some error`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: courtCaseId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toStrictEqual(`${oldForceCode}    `)
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.updatedHearingOutcome).toBeNull()
      expect(actualCourtCase.notes).toHaveLength(0)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })
  })
})
