import SurveyFeedback from "services/entities/SurveyFeedback"
import { expectToHaveNumberOfFeedbacks, loginAndVisit } from "../support/helpers"

const submitAFeedback = () => {
  cy.findByText("feedback").click()
  cy.get(`[name=isAnonymous]`).check("no", { force: true })
  cy.get("[name=experience]").check("0", { force: true })
  cy.get("[name=feedback]").type("This is feedback is not anonymous")
  cy.get("[type=submit]").click()
}

describe("General Feedback Form", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearAllFeedbacksFromDatabase")

    loginAndVisit()
  })

  it("Should be able to submit a feedback that is anonymous", () => {
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")

    cy.get("[name=isAnonymous]").check("yes", { force: true })
    cy.get("[name=experience]").check("0", { force: true })
    cy.get("[name=feedback]").type("Something feedback.")
    cy.get("[type=submit]").click()

    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      expect(feedback.userId).equal(null)
    })
  })

  it("Should be able to submit a feedback that is not anonymous", () => {
    submitAFeedback()
    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      expect(feedback.user.username).equal("GeneralHandler")
    })
  })

  it("Should display error if form is not complete", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)
    cy.get("#isAnonymous").contains("Select one of the below options")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=isAnonymous]").check("no", { force: true })
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=experience]").check("0", { force: true })
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options").should("not.exist")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=feedback]").type("This is feedback is not anonymous")
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(1)
  })

  it("Should redirect back to case list page", () => {
    cy.visit("/bichard")
    submitAFeedback()

    cy.url().should("match", /\/bichard/)
    cy.get("H1").should("have.text", "Case list")
  })

  it("will go back to the case list page when I press the back button", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.contains("Back").click()

    cy.url().should("match", /\/bichard/)
    cy.get("H1").should("have.text", "Case list")
  })

  it("Should redirect back to case details page", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.visit("/bichard/court-cases/0")
    submitAFeedback()

    cy.url().should("match", /\/court-cases\/\d+/)
  })

  it("will go back to the case details page when I press the back button", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.visit("/bichard/court-cases/0")
    cy.findByText("feedback").click()
    cy.contains("Back").click()

    cy.url().should("match", /\/court-cases\/\d+/)
  })
})

export {}
