import { TabHeader, TabHeaders, Tabs } from "../../src/components/Tabs"

describe("Tabs", () => {
  it("Shows only the default tab", () => {
    cy.mount(
      <Tabs defaultValue="tab1">
        <TabHeaders>
          <TabHeader value="tab1">{"Tab 1"}</TabHeader>
          <TabHeader value="tab2">{"Tab 2"}</TabHeader>
          <TabHeader value="tab3">{"Tab 3"}</TabHeader>
        </TabHeaders>
      </Tabs>
    )

    cy.get("#tab1-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
  })
})
