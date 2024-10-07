import SurveyFeedback from "services/entities/SurveyFeedback"
import CaseDetailsTab from "types/CaseDetailsTab"
import CourtCase from "../../src/services/entities/CourtCase"
import users from "../fixtures/users"

export function confirmFiltersAppliedContains(filterTag: string) {
  cy.get(".moj-filter-tags").contains(filterTag)
}

export const exactMatch = (keyword: string): RegExp => {
  return new RegExp("^" + keyword + "$")
}

export const confirmMultipleFieldsDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field)
  })
}
export const submitAndConfirmExceptions = () => {
  cy.get("button").contains("Submit exception(s)").click()
  cy.url().should("match", /\/bichard\/court-cases\/[0-9]+\/submit$/)
  cy.get("button").contains("Submit exception(s)").click()
}

export const confirmMultipleFieldsNotDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field).should("not.exist")
  })
}

export const removeFilterChip = () => {
  cy.get("li button.moj-filter__tag").trigger("click")
  cy.get(".moj-filter__tag").should("not.exist")
}

export const filterByCaseAge = (caseAgeId: string) => {
  cy.get(`label[for="case-age"]`).click()
  cy.get(caseAgeId).click()
}

export const filterByDateRange = (dateFrom: string, dateTo: string) => {
  cy.get(`label[for="date-range"]`).click()

  cy.get(`label[for="date-from"]`).click()
  cy.get(`label[for="date-from"]`).type(dateFrom)

  cy.get(`label[for="date-to"]`).click()
  cy.get(`label[for="date-to"]`).type(dateTo)
}

export const loginAndVisit = (userArg?: string, urlArg?: string) => {
  let user = "GeneralHandler"
  let url = "/bichard"

  if (userArg && !urlArg) {
    if (userArg in users) {
      user = userArg
    } else if (userArg.startsWith("/")) {
      url = userArg
    } else {
      throw new Error("Invalid arguments to loginAndVisit")
    }
  } else if (urlArg && userArg) {
    user = userArg
    url = urlArg
  }

  cy.loginAs(user)
  cy.visit(url)
}

export const clickTab = (tab: CaseDetailsTab) => {
  cy.get(".moj-sub-navigation a").contains(tab).click()
}

export const confirmCaseDisplayed = (PTIURN: string) => {
  cy.get("tbody tr td:nth-child(5)").contains(PTIURN).should("exist")
}

export const confirmCaseNotDisplayed = (PTIURN: string) => {
  cy.get("tbody tr td:nth-child(5)").contains(PTIURN).should("not.exist")
}

export const confirmReasonDisplayed = (reason: string) => {
  cy.get("tbody tr td:nth-child(7)").contains(reason).should("exist")
}

export const confirmReasonNotDisplayed = (reason: string) => {
  cy.get("tbody tr td:nth-child(7)").contains(reason).should("not.exist")
}

export const expectToHaveNumberOfFeedbacks = (number: number) => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    expect(feedbackResults.length).equal(number)
  })
}

export const verifyUpdatedMessage = (args: {
  expectedCourtCase: Partial<CourtCase>
  updatedMessageHaveContent?: string[]
  updatedMessageNotHaveContent?: string[]
}) => {
  cy.task("getCourtCaseById", { caseId: args.expectedCourtCase.errorId }).then((result) => {
    const updatedCase = result as CourtCase
    expect(updatedCase.errorStatus).equal(args.expectedCourtCase.errorStatus)

    if (args.updatedMessageNotHaveContent) {
      args.updatedMessageNotHaveContent.forEach((oldValue) => {
        expect(updatedCase.updatedHearingOutcome).not.match(new RegExp(oldValue))
      })
    }

    if (args.updatedMessageHaveContent) {
      args.updatedMessageHaveContent.forEach((update) => {
        expect(updatedCase.updatedHearingOutcome).match(new RegExp(update))
      })
    }
  })
}

export const resolveExceptionsManually = () => {
  cy.get("button").contains("Mark as manually resolved").click()
  cy.get("H1").should("have.text", "Resolve Case")
  cy.get('select[name="reason"]').select("PNCRecordIsAccurate")
  cy.get("button").contains("Resolve").click()
}
