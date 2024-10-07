import TriggerGroups from "components/SearchFilters/TriggerGroups"

describe("TriggerGroups", () => {
  const dispatch = () => {}

  it("contains Bails checkbox", () => {
    cy.mount(<TriggerGroups dispatch={dispatch} reasonCodes={[]} />)

    cy.get("input#bails[type=checkbox]")
    cy.get("label[for=bails]").contains("Bails")
  })

  it("contains Custody checkbox", () => {
    cy.mount(<TriggerGroups dispatch={dispatch} reasonCodes={[]} />)

    cy.get("input#custody[type=checkbox]")
    cy.get("label[for=custody]").contains("Custody")
  })

  it("contains Orders checkbox", () => {
    cy.mount(<TriggerGroups dispatch={dispatch} reasonCodes={[]} />)

    cy.get("input#orders[type=checkbox]")
    cy.get("label[for=orders]").contains("Orders")
  })

  it("contains Warrants checkbox", () => {
    cy.mount(<TriggerGroups dispatch={dispatch} reasonCodes={[]} />)

    cy.get("input#warrants[type=checkbox]")
    cy.get("label[for=warrants]").contains("Warrants")
  })
})
