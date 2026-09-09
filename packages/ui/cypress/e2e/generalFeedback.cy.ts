import { loginAndVisit } from "../support/helpers"

const clickFeedbackLink = () => cy.findByText("feedback").click()

const submitFeedback = ({ isAnonymous = "no", experience = "0", message = "This feedback is not anonymous" } = {}) => {
  cy.get(`[name=isAnonymous]`).check(isAnonymous, { force: true })
  cy.get("[name=experience]").check(experience, { force: true })
  cy.get("[name=feedback]").type(message)

  submitFeedbackForm()
}

const submitFeedbackForm = () => cy.findByText("Send feedback and continue").click()

const assertOnCaseList = () => {
  cy.url().should("match", /\/bichard/)
  cy.get("H1").should("have.text", "Case list")
}

describe("General Feedback Form", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    loginAndVisit()
  })

  it("Should be able to submit a feedback that is anonymous", () => {
    clickFeedbackLink()
    cy.get("#share-feedback").contains("Share your feedback").should("exist")

    cy.intercept("POST", "**/feedback*").as("postFeedback")

    submitFeedback({ isAnonymous: "yes", experience: "0", message: "This feedback is anonymous" })

    cy.wait("@postFeedback").then(({ request }) => {
      expect(request.body).to.include("isAnonymous=yes")
      expect(request.body).to.include("experience=0")
      expect(request.body).to.include("feedback=This+feedback+is+anonymous")
    })

    assertOnCaseList()
  })

  it("Should be able to submit feedback that is not anonymous", () => {
    clickFeedbackLink()

    cy.intercept("POST", "**/feedback*").as("postFeedback")

    submitFeedback()

    cy.wait("@postFeedback").then(({ request }) => {
      expect(request.body).to.include("isAnonymous=no")
      expect(request.body).to.include("experience=0")
      expect(request.body).to.include("feedback=This+feedback+is+not+anonymous")
    })

    assertOnCaseList()
  })

  it("Should display error if form is not complete", () => {
    clickFeedbackLink()

    submitFeedbackForm()

    cy.get("#isAnonymous").contains("Select one of the below options")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=isAnonymous]").check("no", { force: true })
    submitFeedbackForm()

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=experience]").check("0", { force: true })
    submitFeedbackForm()

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options").should("not.exist")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=feedback]").type("This feedback is not anonymous")
    submitFeedbackForm()

    assertOnCaseList()
  })

  it("Should go back to the case list page when I press the back button", () => {
    clickFeedbackLink()
    cy.contains("Back").click()

    assertOnCaseList()
  })

  it("Should redirect back to case details page after submitting", () => {
    cy.visit("/bichard/court-cases/0")
    clickFeedbackLink()
    submitFeedback()

    cy.url().should("match", /\/court-cases\/\d+/)
  })

  it("Should go back to the case details page when I press the back button", () => {
    cy.visit("/bichard/court-cases/0")
    clickFeedbackLink()
    cy.contains("Back").click()

    cy.url().should("match", /\/court-cases\/\d+/)
  })
})

export {}
