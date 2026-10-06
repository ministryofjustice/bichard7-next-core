import { subDays } from "date-fns"
import HO100206 from "../../test/test-data/HO100206.json"
import { loginAndVisit } from "../support/helpers"

describe("infoBanner", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })

    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  const doNotWait = false
  const wait = true

  const visitWithBannerParams = (
    url: string,
    date: string,
    wait: boolean = false,
    forcesVisibleTo: string | undefined = undefined,
    message: string | undefined = "Test message"
  ) => {
    cy.visit(url, {
      onBeforeLoad(window) {
        window.TEST_INFO_BANNER_FIRST_SHOWN = date
        window.TEST_INFO_BANNER_FORCES_VISIBLE_TO = forcesVisibleTo
        window.TEST_INFO_BANNER_MESSAGE = message
      }
    })

    // We use "useEffect" on the client so we have to wait for the React lifecycle to run
    if (wait) {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100)
    }
  }

  describe("Dates", () => {
    it("doesn't appear when first shown date is not set in config.ts", () => {
      loginAndVisit()

      cy.get(".info-banner").should("not.exist")
    })

    it("appears for five days from the first shown date", () => {
      cy.loginAs("GeneralHandler")

      const fourDaysAgo = new Date()
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
      visitWithBannerParams("/bichard", new Date(fourDaysAgo).toISOString())
      cy.get(".info-banner").should("exist")

      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      visitWithBannerParams("/bichard", new Date(threeDaysAgo).toISOString())
      cy.get(".info-banner").should("exist")

      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      visitWithBannerParams("/bichard", new Date(twoDaysAgo).toISOString())
      cy.get(".info-banner").should("exist")

      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      visitWithBannerParams("/bichard", new Date(oneDayAgo).toISOString())
      cy.get(".info-banner").should("exist")

      const today = new Date()
      visitWithBannerParams("/bichard", new Date(today).toISOString())
      cy.get(".info-banner").should("exist")
    })

    it("disappears after five days from the first shown date", () => {
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
      visitWithBannerParams("/bichard", new Date(fiveDaysAgo).toISOString(), wait)

      cy.get(".info-banner").should("not.exist")
    })

    it("disappears when closed and does not reappear on that particular day", () => {
      visitWithBannerParams("/bichard", new Date().toISOString())

      cy.get(".info-banner").should("exist")

      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      cy.reload()
      visitWithBannerParams("/bichard", new Date().toISOString(), wait)
      cy.get(".info-banner").should("not.exist")
    })

    it("disappears when closed on today and does reappear on next day", () => {
      const firstShownDateYesterday = subDays(new Date(), 1)

      visitWithBannerParams("/bichard", firstShownDateYesterday.toISOString())

      cy.get(".info-banner").should("exist")

      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      visitWithBannerParams("/bichard", firstShownDateYesterday.toISOString(), wait)
      cy.get(".info-banner").should("not.exist")

      cy.visit("/bichard", {
        onBeforeLoad(win) {
          win.TEST_INFO_BANNER_FIRST_SHOWN = firstShownDateYesterday.toISOString()
          win.localStorage.setItem("infoBannerLastClosed", firstShownDateYesterday.toISOString())
        }
      })

      cy.get(".info-banner").should("exist")
    })

    it("persists when navigating through different pages", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: HO100206.hearingOutcomeXml,
          updatedHearingOutcome: HO100206.hearingOutcomeXml,
          errorCount: 1
        }
      ])

      visitWithBannerParams("/bichard", new Date().toISOString())
      cy.get(".info-banner").should("exist")

      visitWithBannerParams("/bichard/court-cases/0", new Date().toISOString())
      cy.get(".info-banner").should("exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams("/bichard/court-cases/0/resolve", new Date().toISOString())
      cy.get(".info-banner").should("exist")
    })

    it("disappears when closed on a case-list page and does not reappear on navigating through different pages", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: HO100206.hearingOutcomeXml,
          updatedHearingOutcome: HO100206.hearingOutcomeXml,
          errorCount: 1
        }
      ])

      visitWithBannerParams("/bichard", new Date().toISOString(), doNotWait)

      cy.get(".info-banner").should("exist")
      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      visitWithBannerParams("/bichard/court-cases/0", new Date().toISOString(), wait)
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams("/bichard/court-cases/0/resolve", new Date().toISOString(), wait)
      cy.get(".info-banner").should("not.exist")
    })

    it("disappears closed on a case-details page and does not reappear on case-list or any other page", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: HO100206.hearingOutcomeXml,
          updatedHearingOutcome: HO100206.hearingOutcomeXml,
          errorCount: 1
        }
      ])

      visitWithBannerParams("/bichard", new Date().toISOString(), doNotWait)
      cy.get(".info-banner").should("exist")

      visitWithBannerParams("/bichard/court-cases/0", new Date().toISOString(), wait)
      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams("/bichard/court-cases/0/resolve", new Date().toISOString(), wait)
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Case list").click()
      visitWithBannerParams("/bichard", new Date().toISOString(), wait)
      cy.get(".info-banner").should("not.exist")
    })

    it("doesn't appear if firstShownDate is in future", () => {
      const futureFirstShownDate = new Date()
      futureFirstShownDate.setDate(futureFirstShownDate.getDate() + 5)

      visitWithBannerParams("/bichard", futureFirstShownDate.toISOString(), wait)

      cy.get("h2")
      cy.get(".info-banner").should("not.exist")
    })
  })

  describe("Visible to forces", () => {
    it("appears for the current user when forcesVisibleTo is empty", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true)
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo is 'ALL'", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true, "ALL")
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo contains only their force", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true, "01")
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo contains their force and other forces", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true, "01,099,66")
      cy.get(".info-banner").should("exist")
    })

    it("is hidden for the current user when forcesVisibleTo is not empty, but doesn't contain their force", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true, "099")
      cy.get(".info-banner").should("not.exist")
    })
  })

  describe("Message", () => {
    it("displays the specified message", () => {
      visitWithBannerParams("/bichard", new Date().toISOString(), true, "01", "Different test message")
      cy.get(".info-banner").should("contain", "Different test message")
    })
  })
})
