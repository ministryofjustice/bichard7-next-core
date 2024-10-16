import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import TriggerCheckbox from "components/SearchFilters/TriggerCheckbox"
import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

describe("TriggerCheckbox", () => {
  const dispatch = () => {}
  const triggerCode = GroupedTriggerCodes[TriggerCodeGroups.Bails][0]

  it("contains unchecked checkbox", () => {
    cy.mount(<TriggerCheckbox dispatch={dispatch} triggerCode={triggerCode} selectedTrigger={false} />)

    cy.get(`input#${triggerCode.toLowerCase()}[checked]`).should("not.exist")
    cy.get(`input#${triggerCode.toLowerCase()}`).should("exist")
  })

  it("contains checked checkbox", () => {
    cy.mount(<TriggerCheckbox dispatch={dispatch} triggerCode={triggerCode} selectedTrigger={true} />)

    cy.get(`input#${triggerCode.toLowerCase()}[checked]`).should("exist")
  })

  it("contains the short code in the label", () => {
    cy.mount(<TriggerCheckbox dispatch={dispatch} triggerCode={triggerCode} selectedTrigger={true} />)

    cy.get(`label[for=${triggerCode.toLowerCase()}]`).contains("PR08")
  })

  it("contains the short description in the label", () => {
    cy.mount(<TriggerCheckbox dispatch={dispatch} triggerCode={triggerCode} selectedTrigger={true} />)

    cy.get(`label[for=${triggerCode.toLowerCase()}]`).contains("Breach of bail")
  })

  it("fires dispatch function when the change event if triggered when unchecked", () => {
    const realDispatch: Dispatch<FilterAction> = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("add")
      expect(type).to.equals("reasonCodesCheckbox")
      expect(value).to.equals("PR08")
    }

    cy.mount(<TriggerCheckbox dispatch={realDispatch} triggerCode={triggerCode} selectedTrigger={false} />)

    cy.get(`label[for=${triggerCode.toLowerCase()}]`).click()
  })

  it("fires dispatch function when the change event if triggered when checked", () => {
    const realDispatch: Dispatch<FilterAction> = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("remove")
      expect(type).to.equals("reasonCodesCheckbox")
      expect(value).to.equals("PR08")
    }

    cy.mount(<TriggerCheckbox dispatch={realDispatch} triggerCode={triggerCode} selectedTrigger={true} />)

    cy.get(`label[for=${triggerCode.toLowerCase()}]`).click()
  })
})
