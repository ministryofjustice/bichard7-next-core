import { CjsPlea } from "@moj-bichard7-developers/bichard7-next-core/core/types/Plea"
import ResultClass from "@moj-bichard7-developers/bichard7-next-core/core/types/ResultClass"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import { CourtCaseContext } from "context/CourtCaseContext"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { HearingResult } from "../../src/features/CourtCaseDetails/Tabs/Panels/Offences/Offence/HearingResult"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DisplayFullUser } from "types/display/Users"
import Permission from "types/Permission"

const courtCase = {
  aho: {
    Exceptions: [
      {
        code: "HO100307",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          2,
          "Result",
          0,
          "CJSresultCode"
        ]
      }
    ]
  }
} as unknown as DisplayFullCourtCase

const currentUser = {
  username: "",
  email: "",
  visibleForces: [],
  visibleCourts: [],
  excludedTriggers: [],
  featureFlags: {},
  groups: [],
  hasAccessTo: {
    [Permission.CaseDetailsSidebar]: false,
    [Permission.Exceptions]: false,
    [Permission.Triggers]: false,
    [Permission.UnlockOtherUsersCases]: false,
    [Permission.ListAllCases]: false,
    [Permission.ViewReports]: false,
    [Permission.ViewUserManagement]: false
  }
} as DisplayFullUser

describe("Hearing Result", () => {
  let result: Result
  const dummyIndex = 0

  beforeEach(() => {
    result = {
      CJSresultCode: 1234,
      ResultHearingType: "hearing type",
      ResultHearingDate: new Date("2022-09-10"),
      NextHearingDate: new Date("2022-09-11"),
      PleaStatus: CjsPlea.Guilty,
      Verdict: verdicts[1].cjsCode,
      ModeOfTrialReason: "reason",
      ResultVariableText: "this is some text",
      PNCDisposalType: 1,
      ResultClass: ResultClass.ADJOURNMENT,
      PNCAdjudicationExists: true
    } as Result
  })

  it("displays all mandatory fields", () => {
    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <HearingResult
            result={result}
            resultIndex={dummyIndex}
            selectedOffenceSequenceNumber={dummyIndex}
            exceptions={[]}
            stopLeavingFn={() => {}}
          />
        </CurrentUserContext.Provider>
      </CourtCaseContext.Provider>
    )

    cy.contains("td", "CJS Code").siblings().should("include.text", "1234")
    cy.contains("td", "Result hearing type").siblings().should("include.text", "Hearing type")
    cy.contains("td", "Result hearing date").siblings().should("include.text", "10/09/2022")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "11/09/2022")
    cy.contains("td", "Mode of trial reason").siblings().should("include.text", "reason")
    cy.contains("td", "Hearing result text").siblings().should("include.text", "this is some text")
    cy.contains("td", "PNC disposal type").siblings().should("include.text", 1)
    cy.contains("td", "Result class").siblings().should("include.text", "Adjournment")
    cy.contains("td", "PNC adjudication exists").siblings().should("include.text", "Y")
  })

  describe("Durations", () => {
    it("displays the duration length and unit", () => {
      result.Duration = [
        {
          DurationLength: 6,
          DurationType: "",
          DurationUnit: "M"
        }
      ]

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={dummyIndex}
              selectedOffenceSequenceNumber={dummyIndex}
              exceptions={[]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Duration").siblings().should("include.text", "6 months")
    })

    it("does not display the duration row if not present", () => {
      result.Duration = undefined

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={dummyIndex}
              selectedOffenceSequenceNumber={dummyIndex}
              exceptions={[]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Duration").should("not.exist")
    })

    it("displays multiple durations", () => {
      result.Duration = [
        {
          DurationLength: 3,
          DurationType: "",
          DurationUnit: "Y"
        },
        {
          DurationLength: 28,
          DurationType: "",
          DurationUnit: "D"
        }
      ]
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={dummyIndex}
              selectedOffenceSequenceNumber={dummyIndex}
              exceptions={[]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )
      cy.contains("td", "Duration").siblings().should("include.text", "3 years")
      cy.contains("td", "Duration").siblings().should("include.text", "28 days")
    })
  })

  describe("Next hearing date", () => {
    it("does not display the next hearing date row if not present", () => {
      result.NextHearingDate = undefined

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={dummyIndex}
              selectedOffenceSequenceNumber={dummyIndex}
              exceptions={[]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Next hearing date").should("not.exist")
    })

    it("displays the next hearing date with an invalid value", () => {
      result.NextHearingDate = "false"

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={dummyIndex}
              selectedOffenceSequenceNumber={dummyIndex}
              exceptions={[]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    })

    it("displays the next hearing date field when it has no value but has an error", () => {
      result.NextHearingDate = undefined

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={0}
              selectedOffenceSequenceNumber={0}
              exceptions={[{ path: ["dummyPath", "NextHearingDate"], code: ExceptionCode.HO100323 }]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    })

    it("displays the next hearing location field when it has no value but has an error", () => {
      result.NextResultSourceOrganisation = undefined

      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={0}
              selectedOffenceSequenceNumber={0}
              exceptions={[
                {
                  path: ["dummyPath", "NextResultSourceOrganisation", "OrganisationUnitCode"],
                  code: ExceptionCode.HO100200
                }
              ]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "Next hearing location").siblings().should("include.text", "")
    })
  })

  describe("CJS result code", () => {
    it("Should display an error prompt when a HO100307 is raised", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CurrentUserContext.Provider value={{ currentUser }}>
            <HearingResult
              result={result}
              resultIndex={0}
              selectedOffenceSequenceNumber={0}
              exceptions={[{ path: ["dummyPath", "CJSresultCode"], code: ExceptionCode.HO100307 }]}
              stopLeavingFn={() => {}}
            />
          </CurrentUserContext.Provider>
        </CourtCaseContext.Provider>
      )

      cy.contains("td", "CJS Code").should(
        "include.text",
        "This code could not be found via look-up, report the issue to Bichard 7 team and the courts for the correct so that they can investigate this issue and advise."
      )
    })
  })
})
