import { RefreshButton } from "../../../src/components/Buttons/RefreshButton"
import * as NextRouter from "next/router"
import { format, addSeconds } from "date-fns"

describe("RefreshButton", () => {
  beforeEach(() => {
    const eventsOnStub = cy.stub().as("routerEventsOn")
    const reloadStub = cy.stub().as("routerReload")

    let actualRouteChangeHandler: (() => void) | undefined

    eventsOnStub.callsFake((eventName, handler) => {
      // Capture the handler so we can call it manually on reload
      if (eventName === "routeChangeComplete") {
        actualRouteChangeHandler = handler
      }
    })

    reloadStub.callsFake(() => {
      actualRouteChangeHandler?.()
    })

    cy.stub(NextRouter, "default").value({
      asPath: "/",
      reload: reloadStub,
      events: {
        on: eventsOnStub
      }
    })
  })

  it("mounts", () => {
    cy.mount(<RefreshButton location="test" />)
  })

  it("sets class name", () => {
    cy.mount(<RefreshButton location="test" />)
    cy.get("div").should("have.class", "test-refresh-container")
  })

  it("shows the time since last refresh initially", () => {
    cy.mount(<RefreshButton location="test" />)
    cy.get("span.govuk-body-s").should("have.text", "Last updated less than a minute ago")
  })

  it("shows the time since last refresh changing over time", () => {
    const currentDate = new Date()
    cy.clock(currentDate.getTime())

    cy.mount(<RefreshButton location="test" />)
    cy.get("span.govuk-body-s").should("have.text", "Last updated less than a minute ago")

    cy.tick(300_000) // Move time forward by 5 minutes
    cy.get("span.govuk-body-s").should("have.text", "Last updated 5 minutes ago")
  })

  it("time changes after a manual refresh", () => {
    const currentDate = new Date()
    cy.clock(currentDate.getTime())

    cy.mount(<RefreshButton location="test" />)
    cy.get("span.govuk-body-s")
      .should("have.attr", "title")
      .and("include", `Last updated at ${format(currentDate, "HH:mm:ss dd/MM/yyyy")}`)

    cy.tick(300_000) // Move time forward by 5 minutes
    cy.get("button").click()
    cy.get("@routerReload").should("have.been.calledOnce")
    cy.get("span.govuk-body-s")
      .should("have.attr", "title")
      .and("include", `Last updated at ${format(addSeconds(currentDate, 300), "HH:mm:ss dd/MM/yyyy")}`)
  })
})
