import AsnExceptionHO100206 from "../../../../test/test-data/AsnExceptionHo100206.json"
import multipleExceptions from "../../../../test/test-data/MultipleExceptions.json"
import nextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"
import nextHearingLocationExceptions from "../../../../test/test-data/NextHearingLocationExceptions.json"

describe("Court cases - Submit exceptions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should resubmit a case when edits are made and the submit button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "01"
      }
    ])

    cy.visit("/bichard/court-cases/0")

    cy.get("button.exception-location").contains("Offence 1").click()
    cy.get("input.govuk-input").first().type("2024-12-12")
    cy.get("button#submit").contains("Submit exception(s)").click()

    cy.url().should("match", /\/bichard\/court-cases\/0\/submit/)
    cy.get("#main-content").get(".moj-banner").should("not.exist")

    cy.get("p")
      .eq(1)
      .should(
        "have.text",
        "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
      )

    cy.get("button").contains("Submit exception(s)").click()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("/bichard/court-cases/0")
    })

    cy.contains("Notes").click()
    cy.contains("GeneralHandler: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2024-12-12")
    cy.contains("GeneralHandler: Portal Action: Resubmitted Message.")
  })

  it("Should be able to resubmit a case when no updates made on editable field", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "01"
      }
    ])

    cy.visit("/bichard/court-cases/0")

    cy.get("button").contains("Submit exception(s)").should("be.enabled")
  })

  it("Should not resubmit a case when cancel button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        orgForPoliceFilter: "01"
      }
    ])

    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2024-01-01")

    cy.get("button").contains("Submit exception(s)").click()
    cy.url().should("match", /\/bichard\/court-cases\/0\/submit/)

    cy.get("a").contains("Cancel").click()
    cy.location().should((loc) => {
      expect(loc.href).to.contain("/bichard/court-cases/0")
    })

    cy.contains("Notes").click()
    cy.get("form label").contains("Add a new note")

    cy.get("button").contains("Submit exception(s)")
  })

  describe("Submit exception(s) button", () => {
    const insertNextHearingDate = (offenceTitle: string): void => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains(offenceTitle).click()
      cy.get(".hearing-result-1 #next-hearing-date").type("2024-01-01")
    }

    const insertNextHearingLocation = (offenceTitle: string): void => {
      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains(offenceTitle).click()
      cy.get("#next-hearing-location").clear()
      cy.get("#next-hearing-location").type("B01EF01")
    }

    const insertAsn = (value: string): void => {
      cy.get("ul.moj-sub-navigation__list").contains("Defendant").click()
      cy.get("#asn").type(value)
    }

    const insertCourtCase = (hearingOutcomeXml: string): void => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: hearingOutcomeXml,
          errorCount: 1,
          errorLockedByUsername: null,
          triggerLockedByUsername: null
        }
      ])
    }
    it("Should be enabled when multiple exceptions are raised and only some editable fields are updated", () => {
      insertCourtCase(multipleExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      insertNextHearingLocation("Offence with HO100200 - Unrecognised Force or Station Code")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()
      cy.get("button").contains("Submit exception(s)").should("be.enabled")

      cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
      cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
      cy.get(".hearing-result-1 #next-hearing-date").clear()

      cy.get("ul.moj-sub-navigation__list").contains("Defendant").click()
      cy.get("#asn").type("1101ZD0100000448754K")
      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when multiple exceptions are raised and all the editable fields are updated", () => {
      insertCourtCase(multipleExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      insertNextHearingDate("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      insertNextHearingLocation("Offence with HO100200 - Unrecognised Force or Station Code")
      cy.get("a.govuk-back-link").contains("Back to all offences").click()

      insertAsn("1101ZD0100000448754K")

      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    // ASN could be updated on the PNC
    it("Should be enabled when ASN exception is raised and ASN editable field is not updated", () => {
      insertCourtCase(AsnExceptionHO100206.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when ASN exception is raised and ASN editable field is updated", () => {
      insertCourtCase(AsnExceptionHO100206.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      insertAsn("1101ZD0100000448754K")
      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when Next Hearing Date exception is raised and Next Hearing Date editable field is updated", () => {
      insertCourtCase(nextHearingDateExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      insertNextHearingDate("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION")
      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when Next Hearing Date exception is raised and Next Hearing Date editable field is not updated", () => {
      insertCourtCase(nextHearingDateExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when Next Hearing Location exception is raised and Next Hearing Location editable field is updated", () => {
      insertCourtCase(nextHearingLocationExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      insertNextHearingLocation("Offence with HO100200 - Unrecognised Force or Station Code")
      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })

    it("Should be enabled when Next Hearing Location exception is raised and Next Hearing Location editable field is not updated", () => {
      insertCourtCase(nextHearingLocationExceptions.hearingOutcomeXml)

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Submit exception(s)").should("be.enabled")
    })
  })
})
