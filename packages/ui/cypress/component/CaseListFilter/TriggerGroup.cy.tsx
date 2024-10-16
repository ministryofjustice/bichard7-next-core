import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import TriggerGroup from "components/SearchFilters/TriggerGroup"
import { ReasonCode } from "types/CourtCaseFilter"

describe("TriggerGroup", () => {
  const dispatch = () => {}
  const filteredReasonCodes: ReasonCode[] = GroupedTriggerCodes[TriggerCodeGroups.Bails].map((triggerCode) => {
    return {
      value: triggerCode
    } as ReasonCode
  })

  it("contains unchecked checkbox", () => {
    cy.mount(
      <TriggerGroup
        dispatch={dispatch}
        name={"Bails"}
        allGroupTriggers={GroupedTriggerCodes[TriggerCodeGroups.Bails]}
        filteredReasonCodes={[]}
      />
    )

    cy.get("input#bails[checked]").should("not.exist")
    cy.get("input#bails").should("exist")
  })

  it("contains all checked checkbox for a TriggerGroup", () => {
    cy.mount(
      <TriggerGroup
        dispatch={dispatch}
        name={"Bails"}
        allGroupTriggers={GroupedTriggerCodes[TriggerCodeGroups.Bails]}
        filteredReasonCodes={filteredReasonCodes}
      />
    )

    cy.get("input#bails[checked]").should("exist")

    GroupedTriggerCodes[TriggerCodeGroups.Bails].forEach((triggerCode) => {
      cy.get(`input#${triggerCode.toLowerCase()}[checked]`).should("exist")
    })
  })

  it("contains indeterminate checkbox for a TriggerGroup", () => {
    cy.mount(
      <TriggerGroup
        dispatch={dispatch}
        name={"Bails"}
        allGroupTriggers={GroupedTriggerCodes[TriggerCodeGroups.Bails]}
        filteredReasonCodes={[filteredReasonCodes[0]]}
      />
    )

    cy.get("input#bails[checked]").should("not.exist")
    cy.get("input#bails:indeterminate").should("exist")
    cy.get("input#bails").invoke("prop", "indeterminate").should("exist")

    GroupedTriggerCodes[TriggerCodeGroups.Bails].forEach((triggerCode) => {
      if (triggerCode === GroupedTriggerCodes[TriggerCodeGroups.Bails][0]) {
        cy.get(`input#${triggerCode.toLowerCase()}[checked]`).should("exist")
      } else {
        cy.get(`input#${triggerCode.toLowerCase()}[checked]`).should("not.exist")
        cy.get(`input#${triggerCode.toLowerCase()}`).should("exist")
      }
    })
  })
})
