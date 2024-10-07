import ErrorMessages from "types/ErrorMessages"
import HO100306andHO100251 from "../../../../test/test-data/HO100306andHO100251.json"
import HO100307 from "../../../../test/test-data/HO100307.json"
import HO100309 from "../../../../test/test-data/HO100309.json"
import HO200113 from "../../../../test/test-data/HO200113.json"
import HO200114 from "../../../../test/test-data/HO200114.json"
import { loginAndVisit } from "../../../support/helpers"

describe("View Exception Handler Prompts", () => {
  const caseWithOffenceQualifierError = 0
  const caseWithOffenceCodeErrors = 1
  const caseWithNoError = 2
  const caseWithCJSCodeError = 3

  before(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorId: caseWithOffenceQualifierError,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100309.hearingOutcomeXml
      },
      {
        errorId: caseWithOffenceCodeErrors,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100306andHO100251.hearingOutcomeXml
      },
      {
        errorId: caseWithCJSCodeError,
        orgForPoliceFilter: "01",
        errorCount: 1,
        triggerCount: 1,
        hearingOutcome: HO100307.hearingOutcomeXml
      },
      {
        errorId: caseWithNoError,
        orgForPoliceFilter: "01"
      }
    ])
  })

  context("Result Code Qualifier not found - HO100309", () => {
    it("Should display no error prompt if a HO100309 is not raised", () => {
      loginAndVisit(`/bichard/court-cases/${caseWithNoError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003").click()
      cy.get(".qualifier-code-table").contains("A")
    })

    it("Should display an error prompt when a HO100309 is raised", () => {
      loginAndVisit(`/bichard/court-cases/${caseWithOffenceQualifierError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get(".error-prompt").contains(ErrorMessages.QualifierCode)

      cy.get("button").contains("Next offence").click()
      cy.get(".error-prompt").should("not.exist")

      cy.get("button").contains("Next offence").click()
      cy.get(".error-prompt").should("not.exist")
    })

    it("Should not display any error prompts when exceptions are marked as manually resolved", () => {
      loginAndVisit(`/bichard/court-cases/${caseWithOffenceQualifierError}`)

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table").contains("XX")
      cy.get(".qualifier-code-table .error-prompt").contains(ErrorMessages.QualifierCode)
      cy.get(".offences-table").contains("YY10XYZXX")
      cy.get(".offences-table .error-prompt").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("#exceptions-tab").contains("Exceptions").click()
      cy.get("button").contains("Mark as manually resolved").click()
      cy.get("button").contains("Resolve").click()

      cy.visit(`/bichard/court-cases/${caseWithOffenceQualifierError}`)
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Aid and abet theft").click()

      cy.get(".qualifier-code-table .error-prompt").should("not.exist")
      cy.get(".offences-table .error-prompt").should("not.exist")
    })
  })

  context("Offence code error prompts for OffenceCode errors", () => {
    beforeEach(() => {
      loginAndVisit(`/bichard/court-cases/${caseWithOffenceCodeErrors}`)
    })

    it("Should display no error prompt if HO100306 or HO100251 are not raised", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with no errors").click()
      cy.get(".offences-table").contains("RT88191")
      cy.get(".offences-table .error-prompt").should("not.exist")
    })

    it("Should display an error prompt when a HO100306 is raised on a national offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("National Offence with Offence Code not found exception").click()

      cy.get(".offences-table").contains("TH68XYZ")
      cy.get(".offences-table .error-prompt").contains(ErrorMessages.HO100306ErrorPrompt)

      cy.get("a.govuk-back-link").contains("Back to all offences").click()
      cy.get(".govuk-link").contains("Offence with no errors").click()
      cy.get(".offences-table .error-prompt").should("not.exist")
    })

    it("Should display an error prompt when a HO100251 is raised on a national offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("National Offence with Offence Code not recognised exception").click()

      cy.get(".offences-table").contains("TH68$$$")
      cy.get(".offences-table .error-prompt").contains(ErrorMessages.HO100251ErrorPrompt)
    })

    it("Should display an error prompt when a HO100306 is raised on a local offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Local Offence with Offence Code not found exception").click()

      cy.get(".offences-table").contains("ABC00")
      cy.get(".offences-table .error-prompt").contains(ErrorMessages.HO100306ErrorPrompt)
    })

    it("Should display an error prompt when a HO100251 is raised on a local offence", () => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Local Offence with Offence Code not recognised exception").click()

      cy.get(".offences-table").contains("$$$$$$")
      cy.get(".offences-table .error-prompt").contains(ErrorMessages.HO100251ErrorPrompt)
    })

    it("Should not display any error prompts when exceptions are marked as manually resolved", () => {
      cy.get("#exceptions-tab").contains("Exceptions").click()
      cy.get("button").contains("Mark as manually resolved").click()
      cy.get("button").contains("Resolve").click()

      cy.visit(`/bichard/court-cases/${caseWithOffenceCodeErrors}`)
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

      cy.get(".govuk-link").contains("National Offence with Offence Code not found exception").click()
      cy.get(".qualifier-code-table .error-prompt").should("not.exist")
      cy.get(".offences-table .error-prompt").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("National Offence with Offence Code not recognised exception").click()
      cy.get(".qualifier-code-table .error-prompt").should("not.exist")
      cy.get(".offences-table .error-prompt").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("Local Offence with Offence Code not found exception").click()
      cy.get(".qualifier-code-table .error-prompt").should("not.exist")
      cy.get(".offences-table .error-prompt").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      cy.get(".govuk-link").contains("Local Offence with Offence Code not recognised exception").click()
      cy.get(".qualifier-code-table .error-prompt").should("not.exist")
      cy.get(".offences-table .error-prompt").should("not.exist")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()
    })
  })

  context("ASN error prompt", () => {
    it("Should not display an error prompt when a HO200113 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get(".defendant-details-table").contains("1101ZD0100000448754K")
      cy.get(".error-prompt-message").should("not.exist")
    })

    it("Should display an error prompt when a HO200113 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1,
          hearingOutcome: HO200113.hearingOutcomeXml
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get(".field-value").contains("2300000000000942133G")
      cy.get(".error-prompt").contains(ErrorMessages.HO200113)
    })

    it("Should not display an error prompt when a HO200114 is not raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get(".defendant-details-table").contains("1101ZD0100000448754K")
      cy.get(".error-prompt-message").should("not.exist")
    })

    it("Should display an error prompt when a HO200114 is raised", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1,
          hearingOutcome: HO200114.hearingOutcomeXml
        }
      ])

      loginAndVisit("/bichard/court-cases/0")

      cy.get(".field-value").contains("2300000000000532316D")
      cy.get(".error-prompt").contains(ErrorMessages.HO200114)
    })
  })
  context("CJS Code Prompt", () => {
    it("Should display an error prompt when a HO100307 is raised", () => {
      loginAndVisit(`/bichard/court-cases/${caseWithCJSCodeError}`)
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link")
        .contains("Use a motor vehicle on a road / public place without third party insurance")
        .click()

      cy.get(".offence-results-table")
        .contains("td", "CJS Code")
        .should(
          "include.text",
          "This code could not be found via look-up, report the issue to Bichard 7 team and the courts for the correct so that they can investigate this issue and advise."
        )
    })

    it("Should not display an error prompt when a HO100307 is not raised", () => {
      loginAndVisit(`/bichard/court-cases/${caseWithNoError}`)
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link")
        .contains("Use a motor vehicle on a road / public place without third party insurance")
        .click()
      cy.get(".offence-results-table")
        .contains("td", "CJS Code")
        .should(
          "not.include.text",
          "This code could not be found via look-up, report the issue to Bichard 7 team and the courts for the correct so that they can investigate this issue and advise."
        )
    })
  })
})
