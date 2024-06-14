jest.mock("./mostSpecificCourtRuleAllowsTrigger")
jest.mock("./mostSpecificForceRuleAllowsTrigger")
import type { Trigger } from "../../phase1/types/Trigger"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import createTriggerIfNecessary from "./createTriggerIfNecessary"
import mostSpecificCourtRuleAllowsTrigger from "./mostSpecificCourtRuleAllowsTrigger"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"

const mockedMostSpecificForceRuleAllowsTrigger = mostSpecificForceRuleAllowsTrigger as jest.Mock
const mockedMostSpecificCourtRuleAllowsTrigger = mostSpecificCourtRuleAllowsTrigger as jest.Mock

describe("createTriggerIfNecessary", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("given trigger is allowed by force and court, creates a trigger", () => {
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(true)
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(true)
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const triggers: Trigger[] = []
    const code = TriggerCode.TRPS0001
    createTriggerIfNecessary(triggers, code, 1, pncUpdateDataset)

    expect(triggers).toEqual([{ code: code, offenceSequenceNumber: 1 }])
  })
  it("given trigger is not allowed by force or court, does not create a trigger", () => {
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(false)
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(false)
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const triggers: Trigger[] = []
    const code = TriggerCode.TRPS0001
    createTriggerIfNecessary(triggers, code, 1, pncUpdateDataset)

    expect(triggers).toHaveLength(0)
  })
  it("given trigger array is populated, adds a trigger to the array", () => {
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(true)
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(true)
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const triggers: Trigger[] = [{ code: TriggerCode.TRPR0027 }]
    const code = TriggerCode.TRPS0001
    createTriggerIfNecessary(triggers, code, 1, pncUpdateDataset)

    expect(triggers).toHaveLength(2)
  })
  it("given no rules exist, creates a trigger", () => {
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(undefined)
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(undefined)
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const triggers: Trigger[] = []
    const code = TriggerCode.TRPS0001
    createTriggerIfNecessary(triggers, code, 1, pncUpdateDataset)

    expect(triggers).toEqual([{ code: code, offenceSequenceNumber: 1 }])
  })
  it("given one rule undefined, creates trigger based on other rule", () => {
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValue(undefined)
    const triggers: Trigger[] = []
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])

    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(true)
    createTriggerIfNecessary(triggers, TriggerCode.TRPS0001, 1, pncUpdateDataset)
    expect(triggers).toEqual([{ code: TriggerCode.TRPS0001, offenceSequenceNumber: 1 }])

    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(false)
    createTriggerIfNecessary(triggers, TriggerCode.TRPS0004, 1, pncUpdateDataset)
    expect(triggers).toEqual([{ code: TriggerCode.TRPS0001, offenceSequenceNumber: 1 }])
  })
  it("given converse rule undefined, creates trigger based on other rule", () => {
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValue(undefined)
    const triggers: Trigger[] = []
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])

    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(true)
    createTriggerIfNecessary(triggers, TriggerCode.TRPS0001, 1, pncUpdateDataset)
    expect(triggers).toEqual([{ code: TriggerCode.TRPS0001, offenceSequenceNumber: 1 }])

    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(false)
    createTriggerIfNecessary(triggers, TriggerCode.TRPS0004, 1, pncUpdateDataset)
    expect(triggers).toEqual([{ code: TriggerCode.TRPS0001, offenceSequenceNumber: 1 }])
  })
  it("given trigger is not permitted by rules but court and force are in different areas and 'out of area' trigger is allowed, creates 'out of area' trigger", () => {
    mockedMostSpecificCourtRuleAllowsTrigger.mockReturnValueOnce(false)
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(false)
    mockedMostSpecificForceRuleAllowsTrigger.mockReturnValueOnce(true)
    const triggers: Trigger[] = []
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([])
    const location = {
      TopLevelCode: "B",
      SecondLevelCode: "A",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00"
    } as OrganisationUnitCodes
    const differentLocation = {
      TopLevelCode: "B",
      SecondLevelCode: "NOT_A!",
      ThirdLevelCode: "BN",
      BottomLevelCode: "00"
    } as OrganisationUnitCodes

    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation = location
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = differentLocation

    createTriggerIfNecessary(triggers, TriggerCode.TRPS0001, 1, pncUpdateDataset)
    expect(triggers).toEqual([{ code: TriggerCode.TRPR0027 }])
  })
})
