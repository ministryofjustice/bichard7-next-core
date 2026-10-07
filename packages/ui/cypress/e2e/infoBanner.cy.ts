import { subDays } from "date-fns"
import HO100206 from "../../test/test-data/HO100206.json"

describe("infoBanner", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })

    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  interface TestBannerParams {
    url: string
    date?: string
    forcesVisibleTo?: string
    message?: string
    lifespanDays?: number
    wait?: boolean
  }

  const defaultBannerParams: TestBannerParams = {
    url: "/bichard",
    date: new Date().toISOString(),
    forcesVisibleTo: "",
    message: "Test message",
    lifespanDays: 5,
    wait: false
  }

  const visitWithBannerParams = ({ url, date, forcesVisibleTo, message, lifespanDays, wait }: TestBannerParams) => {
    cy.visit(url, {
      onBeforeLoad(window) {
        window.TEST_INFO_BANNER_FIRST_SHOWN = date
        window.TEST_INFO_BANNER_FORCES_VISIBLE_TO = forcesVisibleTo
        window.TEST_INFO_BANNER_MESSAGE = message
        window.TEST_INFO_BANNER_LIFESPAN = lifespanDays
      }
    })

    // We use "useEffect" on the client so we have to wait for the React lifecycle to run
    if (wait) {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100)
    }
  }

  describe("Dates and lifespan", () => {
    it("doesn't appear when first shown date is not set in config.ts", () => {
      cy.loginAs("GeneralHandler")
      visitWithBannerParams({ ...defaultBannerParams, date: undefined })
      cy.get(".info-banner").should("not.exist")
    })

    it("doesn't appear when lifespan is not set in config.ts", () => {
      cy.loginAs("GeneralHandler")
      visitWithBannerParams({ ...defaultBannerParams, lifespanDays: undefined })
      cy.get(".info-banner").should("not.exist")
    })

    it("doesn't appear when lifespan is set to NaN in config.ts", () => {
      cy.loginAs("GeneralHandler")
      visitWithBannerParams({ ...defaultBannerParams, lifespanDays: NaN })
      cy.get(".info-banner").should("not.exist")
    })

    it("appears for five days from the first shown date", () => {
      cy.loginAs("GeneralHandler")

      const fourDaysAgo = new Date()
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(fourDaysAgo).toISOString() })
      cy.get(".info-banner").should("exist")

      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(threeDaysAgo).toISOString() })
      cy.get(".info-banner").should("exist")

      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(twoDaysAgo).toISOString() })
      cy.get(".info-banner").should("exist")

      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(oneDayAgo).toISOString() })
      cy.get(".info-banner").should("exist")

      const today = new Date()
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(today).toISOString() })
      cy.get(".info-banner").should("exist")
    })

    it("disappears after five days from the first shown date", () => {
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
      visitWithBannerParams({ ...defaultBannerParams, date: new Date(fiveDaysAgo).toISOString() })

      cy.get(".info-banner").should("not.exist")
    })

    it("disappears when closed and does not reappear on that particular day", () => {
      visitWithBannerParams({ ...defaultBannerParams })

      cy.get(".info-banner").should("exist")

      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      cy.reload()
      visitWithBannerParams({ ...defaultBannerParams, wait: true })
      cy.get(".info-banner").should("not.exist")
    })

    it("disappears when closed on today and does reappear on next day", () => {
      const firstShownDateYesterday = subDays(new Date(), 1)

      visitWithBannerParams({ ...defaultBannerParams, date: firstShownDateYesterday.toISOString() })

      cy.get(".info-banner").should("exist")

      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      visitWithBannerParams({ ...defaultBannerParams, date: firstShownDateYesterday.toISOString() })
      cy.get(".info-banner").should("not.exist")

      cy.visit("/bichard", {
        onBeforeLoad(win) {
          win.TEST_INFO_BANNER_FIRST_SHOWN = firstShownDateYesterday.toISOString()
          win.TEST_INFO_BANNER_LIFESPAN = 5
          win.TEST_INFO_BANNER_MESSAGE = "message"

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

      visitWithBannerParams({ ...defaultBannerParams })
      cy.get(".info-banner").should("exist")

      visitWithBannerParams({ ...defaultBannerParams, url: "/bichard/court-cases/0" })
      cy.get(".info-banner").should("exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams({ ...defaultBannerParams, url: "/bichard/court-cases/0" })
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

      visitWithBannerParams({ ...defaultBannerParams })

      cy.get(".info-banner").should("exist")
      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      visitWithBannerParams({
        ...defaultBannerParams,
        url: "/bichard/court-cases/0",
        wait: true
      })
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams({
        ...defaultBannerParams,
        url: "/bichard/court-cases/0",
        wait: true
      })
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

      visitWithBannerParams({ ...defaultBannerParams })
      cy.get(".info-banner").should("exist")

      visitWithBannerParams({
        ...defaultBannerParams,
        url: "/bichard/court-cases/0",
        wait: true
      })
      cy.get(".info-banner__close").click()
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Mark as manually resolved").click()
      visitWithBannerParams({
        ...defaultBannerParams,
        url: "/bichard/court-cases/0",
        wait: true
      })
      cy.get(".info-banner").should("not.exist")

      cy.get("a").contains("Case list").click()
      visitWithBannerParams({ ...defaultBannerParams, wait: true })
      cy.get(".info-banner").should("not.exist")
    })

    it("doesn't appear if firstShownDate is in future", () => {
      const futureFirstShownDate = new Date()
      futureFirstShownDate.setDate(futureFirstShownDate.getDate() + 5)

      visitWithBannerParams({ ...defaultBannerParams, date: futureFirstShownDate.toISOString(), wait: true })

      cy.get("h2")
      cy.get(".info-banner").should("not.exist")
    })
  })

  describe("Visible to forces", () => {
    it("appears for the current user when forcesVisibleTo is empty", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true })
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo is 'ALL'", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, forcesVisibleTo: "ALL" })
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo contains only their force", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, forcesVisibleTo: "01" })
      cy.get(".info-banner").should("exist")
    })

    it("appears for the current user when forcesVisibleTo contains their force and other forces", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, forcesVisibleTo: "01,099,66" })
      cy.get(".info-banner").should("exist")
    })

    it("is hidden for the current user when forcesVisibleTo is not empty, but doesn't contain their force", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, forcesVisibleTo: "099" })
      cy.get(".info-banner").should("not.exist")
    })
  })

  describe("Message", () => {
    it("displays the specified message", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, message: "Different test message" })
      cy.get(".info-banner").should("contain", "Different test message")
    })

    it("does not display the banner if message is empty", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, message: "" })
      cy.get(".info-banner").should("not.exist")
    })

    it("does not display the banner if message is undefined", () => {
      visitWithBannerParams({ ...defaultBannerParams, wait: true, message: undefined })
      cy.get(".info-banner").should("not.exist")
    })
  })
})
