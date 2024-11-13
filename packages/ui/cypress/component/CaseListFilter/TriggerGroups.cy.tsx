import TriggerGroups from "components/SearchFilters/TriggerGroups"
import { CurrentUserContext } from "context/CurrentUserContext"
import { DisplayFullUser } from "types/display/Users"

describe("TriggerGroups", () => {
  const dispatch = () => {}
  const currentUser = { excludedTriggers: [] } as unknown as DisplayFullUser

  it("contains Bails checkbox", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails[type=checkbox]")
    cy.get("label[for=bails]").contains("Bails")
  })

  it("contains Custody checkbox", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
      </CurrentUserContext.Provider>
    )

    cy.get("input#custody[type=checkbox]")
    cy.get("label[for=custody]").contains("Custody")
  })

  it("contains Orders checkbox", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
      </CurrentUserContext.Provider>
    )

    cy.get("input#orders[type=checkbox]")
    cy.get("label[for=orders]").contains("Orders")
  })

  it("contains Warrants checkbox", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <TriggerGroups dispatch={dispatch} reasonCodes={[]} />
      </CurrentUserContext.Provider>
    )

    cy.get("input#warrants[type=checkbox]")
    cy.get("label[for=warrants]").contains("Warrants")
  })
})
