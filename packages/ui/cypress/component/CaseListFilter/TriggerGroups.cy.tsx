import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import TriggerGroups from "components/SearchFilters/TriggerGroups"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DisplayFullUser } from "types/display/Users"

describe("TriggerGroups", () => {
  const dispatch = () => {}
  beforeEach(() => {
    const currentUser = { visibleForces: ["18"], excludedTriggers: [] } as unknown as DisplayFullUser

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
      </CurrentUserContext.Provider>
    )
  })

  it("contains Bails checkbox", () => {
    cy.get("input#bails[type=checkbox]")
    cy.get("label[for=bails]").contains("Bails")
  })

  it("contains Results checkbox", () => {
    cy.get("input#results[type=checkbox]")
    cy.get("label[for=results]").contains("Results")
  })

  it("contains Custody checkbox", () => {
    cy.get("input#custody[type=checkbox]")
    cy.get("label[for=custody]").contains("Custody")
  })

  it("contains Orders checkbox", () => {
    cy.get("input#orders[type=checkbox]")
    cy.get("label[for=orders]").contains("Orders")
  })

  it("contains Warrants checkbox", () => {
    cy.get("input#warrants[type=checkbox]")
    cy.get("label[for=warrants]").contains("Warrants")
  })

  describe("with all triggers excluded", () => {
    beforeEach(() => {
      const currentUser = {
        visibleForces: ["001"],
        excludedTriggers: [
          TriggerCode.TRPR0001,
          TriggerCode.TRPR0003,
          TriggerCode.TRPR0004,
          TriggerCode.TRPR0005,
          TriggerCode.TRPR0006,
          TriggerCode.TRPR0007,
          TriggerCode.TRPR0008,
          TriggerCode.TRPR0010,
          TriggerCode.TRPR0014,
          TriggerCode.TRPR0015,
          TriggerCode.TRPR0016,
          TriggerCode.TRPR0017,
          TriggerCode.TRPR0018,
          TriggerCode.TRPR0019,
          TriggerCode.TRPR0020,
          TriggerCode.TRPR0021,
          TriggerCode.TRPR0022,
          TriggerCode.TRPR0023,
          TriggerCode.TRPR0024,
          TriggerCode.TRPR0025,
          TriggerCode.TRPR0026,
          TriggerCode.TRPR0027,
          TriggerCode.TRPR0028,
          TriggerCode.TRPR0029,
          TriggerCode.TRPR0030,
          TriggerCode.TRPS0002,
          TriggerCode.TRPS0003,
          TriggerCode.TRPS0004,
          TriggerCode.TRPS0008,
          TriggerCode.TRPS0010,
          TriggerCode.TRPS0011,
          TriggerCode.TRPS0013,
          TriggerCode.TRPR0002,
          TriggerCode.TRPR0012
        ]
      } as unknown as DisplayFullUser

      cy.mount(
        <CurrentUserContext.Provider value={{ currentUser }}>
          <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
        </CurrentUserContext.Provider>
      )
    })

    it("doesn't show any checkbox", () => {
      cy.get("[type=checkbox]").should("have.length", 0)
    })

    it("does show message", () => {
      cy.get(".govuk-body").should("have.text", "No trigger groups")
    })
  })

  describe("with just triggers included", () => {
    beforeEach(() => {
      const currentUser = {
        visibleForces: ["001"],
        excludedTriggers: [
          TriggerCode.TRPR0001,
          TriggerCode.TRPR0003,
          TriggerCode.TRPR0004,
          TriggerCode.TRPR0005,
          TriggerCode.TRPR0006,
          TriggerCode.TRPR0007,
          TriggerCode.TRPR0008,
          TriggerCode.TRPR0010,
          TriggerCode.TRPR0014,
          TriggerCode.TRPR0015,
          TriggerCode.TRPR0016,
          TriggerCode.TRPR0017,
          TriggerCode.TRPR0018,
          TriggerCode.TRPR0019,
          TriggerCode.TRPR0020,
          TriggerCode.TRPR0021,
          TriggerCode.TRPR0022,
          TriggerCode.TRPR0023,
          TriggerCode.TRPR0024,
          TriggerCode.TRPR0025,
          TriggerCode.TRPR0026,
          TriggerCode.TRPR0027,
          TriggerCode.TRPR0028,
          TriggerCode.TRPR0029,
          TriggerCode.TRPR0030,
          TriggerCode.TRPS0002,
          TriggerCode.TRPS0003,
          TriggerCode.TRPS0004,
          TriggerCode.TRPS0008,
          TriggerCode.TRPS0010,
          TriggerCode.TRPS0011,
          TriggerCode.TRPS0013
        ]
      } as unknown as DisplayFullUser

      cy.mount(
        <CurrentUserContext.Provider value={{ currentUser }}>
          <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
        </CurrentUserContext.Provider>
      )
    })

    it("does only show Warrants checkbox", () => {
      cy.get("input#warrants[type=checkbox]").should("have.length", 1)
      cy.get("label[for=warrants]").contains("Warrants")
    })

    it("doesn't show message", () => {
      cy.get(".govuk-body").should("have.length", 0)
    })
  })
})
