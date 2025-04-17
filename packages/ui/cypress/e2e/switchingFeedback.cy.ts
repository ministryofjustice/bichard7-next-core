import { addHours, addMinutes } from "date-fns"
import SurveyFeedback from "services/entities/SurveyFeedback"
import { type SwitchingFeedbackResponse } from "../../src/types/SurveyFeedback"

const getDate = ({ minutes, hours }: { minutes: number; hours: number }) => {
  let date = new Date()
  if (minutes) {
    date = addMinutes(date, minutes)
  }

  if (hours) {
    date = addHours(date, hours)
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  )
}

const navigateAndClickSwitchToOldBichard = (url = "/bichard") => {
  cy.visit(url)
  cy.contains("a", "Switch to old Bichard").click()
}

const expectFeedbackPage = () => {
  cy.get(".send-feedback-email").contains("Send feedback email").should("exist")
}

const clickSkipFeedbackButton = () => {
  cy.get("button").contains("Skip feedback").click()
}

const verifyFeedback = (data: SwitchingFeedbackResponse, expectedUserName = "Supervisor") => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    const feedback = feedbackResults[0]
    expect(feedback.feedbackType).equal(1)
    expect(feedback.user.username).equal(expectedUserName)
    expect(feedback.response).deep.equal(data)
  })
}

const insertFeedback = (createdAt: Date, username = "Supervisor") => {
  cy.task("insertFeedback", {
    username,
    response: { skipped: true },
    feedbackType: 1,
    createdAt
  })
}

describe("Switching Bichard Version Feedback Form", () => {
  before(() => {
    cy.intercept("GET", "/bichard-ui/*", {
      statusCode: 200,
      body: {
        name: "Dummy response"
      }
    })

    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearAllFeedbacksFromDatabase")
    cy.loginAs("Supervisor")
  })

  it("will go back to the case list page when I press the back button", () => {
    cy.visit("/bichard")
    cy.findByText("Switch to old Bichard").click()
    cy.get("a").contains("Back").click()

    cy.url().should("match", /\/bichard/)
    cy.get("H1").should("have.text", "Case list")
  })

  it("will go back to the case details page when I press the back button", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.visit("/bichard/court-cases/0")
    cy.findByText("Switch to old Bichard").click()
    cy.contains("Back").click()

    cy.url().should("match", /\/court-cases\/\d+/)
  })

  it("Should access the switching feedback form when user clicks 'Switch to old Bichard'", () => {
    cy.visit("/bichard")
    cy.contains("a", "Switch to old Bichard").click()
    cy.get("a").contains("Back")
    cy.get("h1").contains("Share your feedback")
    cy.get("p")
      .contains(
        "You have chosen to switch back to old Bichard. Could you share why? Please email us and outline the details of any issues you have experienced. It is helpful for us to receive feedback so that we can make improvements."
      )
      .should("exist")
    cy.get("p").contains("Some examples of feedback are:").should("exist")
    cy.get("button").contains("Skip feedback")
    cy.get("a").contains("Send feedback email")
  })

  it("Should redirect user to old Bichard within 3 hours of first click on 'Switch to old Bichard' after logging in", () => {
    insertFeedback(getDate({ hours: -2, minutes: -55 })) // 2 hours and 55 minutes ago
    navigateAndClickSwitchToOldBichard()
    cy.url().should("match", /\/bichard-ui\/.*$/)
    verifyFeedback({ skipped: true })
  })

  it("Should redirect user to switching survey after 3 hours of a click on 'Switch to old Bichard'", () => {
    insertFeedback(getDate({ hours: -3, minutes: -5 })) // 3 hours and 05 minutes ago
    navigateAndClickSwitchToOldBichard()
    expectFeedbackPage()
  })

  it("Should redirect to case list in old Bichard", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackPage()

    const expectedSubject = "Feedback: <Subject here>"
    const expectedBody =
      "Please describe the issues you have experienced, including Username and Force - the more detail the better. If you have any screenshots, please attach them to the email."
    const encodedSubject = encodeURIComponent(expectedSubject)
    const encodedBody = encodeURIComponent(expectedBody)

    cy.get(".send-feedback-email")
      .should("have.attr", "href")
      .and("include", `mailto:moj-bichard7@madetech.com?subject=${encodedSubject}&body=${encodedBody}`)
    cy.get("a").contains("Send feedback email").click()
    cy.url().should("match", /\/bichard-ui\/RefreshListNoRedirect$/)
  })

  it("Should redirect to the same case detail page in old Bichard", () => {
    navigateAndClickSwitchToOldBichard("/bichard/court-cases/0")
    expectFeedbackPage()
    clickSkipFeedbackButton()
    cy.url().should("match", /\/bichard-ui\/SelectRecord\?unstick=true&error_id=0$/)
  })
})
