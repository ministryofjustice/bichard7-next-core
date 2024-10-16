import { addHours, addMinutes } from "date-fns"
import SurveyFeedback from "services/entities/SurveyFeedback"
import { Page, SwitchingReason, type SwitchingFeedbackResponse } from "../../src/types/SurveyFeedback"

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
  cy.contains("button", "Switch to old Bichard").click()
}

const expectFeedbackForm = () => {
  cy.get("#pageWithIssue").should("not.exist")
  cy.get("#comment").should("not.exist")
  cy.get("button").contains("Send feedback and continue").should("not.exist")
}

const typeFeedback = () => {
  cy.get("textarea[name=feedback]").type("Some feedback")
}

const clickSendFeedbackButton = () => {
  cy.get("button").contains("Send feedback and continue").click()
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

const verifyNoFeedbackExists = () => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    expect(feedbackResults).to.have.length(0)
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

  it("Should access the switching feedback form with first question visible when user clicks 'Switch to old Bichard'", () => {
    cy.visit("/bichard")
    cy.contains("button", "Switch to old Bichard").click()
    cy.get("a").contains("Back")
    cy.get("button").contains("Skip feedback")
    cy.get("h1").contains("Share your feedback")
    cy.get("p")
      .contains(
        "You have selected to revert back to old Bichard. What was the reason for doing so? Can you please select the appropriate option. And outline the problem that occurred below so that we can best understand."
      )
      .should("exist")
    cy.get("h3").contains("Why have you decided to switch version of Bichard?")
    cy.get("h5").contains("Select one of the below option")
    cy.get("label").contains(
      "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task."
    )
    cy.get("label").contains("I prefer working in the old version, and I dislike working in the new version.")
    cy.get("label").contains("Other (please specify)")
  })

  it("Found an issue > Case list page > Give feedback > Submit", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy
      .get(
        'label:contains("I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.")'
      )
      ?.click()
    cy.get('label:contains("Case list page")')?.click()
    cy.contains("Could you explain in detail what problem you have experienced?").should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    verifyFeedback({
      comment: "Some feedback",
      pageWithIssue: Page.caseList,
      switchingReason: SwitchingReason.issue
    })
  })

  it("Found an issue > Case details page > Give feedback > Submit", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy
      .get(
        'label:contains("I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.")'
      )
      ?.click()
    cy.get('label:contains("Case details page")')?.click()
    cy.contains("Could you explain in detail what problem you have experienced?").should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    verifyFeedback({
      comment: "Some feedback",
      pageWithIssue: Page.caseDetails,
      switchingReason: SwitchingReason.issue
    })
  })

  it("Prefer old Bichard > Give feedback > Submit", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy.get('label:contains("I prefer working in the old version, and I dislike working in the new version.")')?.click()
    cy.contains(
      "Could you please explain why you prefer using the old version of Bichard over the new version Bichard?"
    ).should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    verifyFeedback({ comment: "Some feedback", switchingReason: SwitchingReason.preference })
  })

  it("Other > Give feedback > Submit", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy.get('label:contains("Other (please specify)")')?.click()
    cy.contains("Is there another reason why you are switching version of Bichard?").should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    verifyFeedback({ comment: "Some feedback", switchingReason: SwitchingReason.other })
  })

  it("Found an issue > Don't fill anything > Submit", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy
      .get(
        'label:contains("I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.")'
      )
      ?.click()
    clickSendFeedbackButton()
    cy.contains("Input message into the text box").should("exist")
    verifyNoFeedbackExists()
  })

  it("Option > Don't fill anything in > Submit ", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy.get('label:contains("Other (please specify)")')?.click()
    clickSendFeedbackButton()
    cy.contains("Input message into the text box").should("exist")
    verifyNoFeedbackExists()
  })

  it("Skip Feedback > Database record skip > old Bichard", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    clickSkipFeedbackButton()
    verifyFeedback({ skipped: true })
    cy.url().should("match", /\/bichard-ui\/.*$/)
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
    expectFeedbackForm()
  })

  it("Should redirect to case list in old Bichard", () => {
    navigateAndClickSwitchToOldBichard()
    expectFeedbackForm()
    cy.get('label:contains("Other (please specify)")')?.click()
    cy.contains("Is there another reason why you are switching version of Bichard?").should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    cy.url().should("match", /\/bichard-ui\/RefreshListNoRedirect$/)
  })

  it("Should redirect to the same case detail page in old Bichard", () => {
    navigateAndClickSwitchToOldBichard("/bichard/court-cases/0")
    expectFeedbackForm()
    cy.get('label:contains("Other (please specify)")')?.click()
    cy.contains("Is there another reason why you are switching version of Bichard?").should("exist")
    typeFeedback()
    clickSendFeedbackButton()
    cy.url().should("match", /\/bichard-ui\/SelectRecord\?unstick=true&error_id=0$/)
  })
})
