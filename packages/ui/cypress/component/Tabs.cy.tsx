import { TabHeader, TabHeaders, TabPanel, Tabs } from "../../src/components/Tabs"

describe("Tabs", () => {
  it("Shows only the default tab", () => {
    cy.mount(
      <Tabs defaultValue="tab1">
        <TabHeaders>
          <TabHeader value="tab1">{"Tab 1"}</TabHeader>
          <TabHeader value="tab2">{"Tab 2"}</TabHeader>
          <TabHeader value="tab3">{"Tab 3"}</TabHeader>
        </TabHeaders>
        <TabPanel value="tab1">{"Tab 1 content"}</TabPanel>
        <TabPanel value="tab2">{"Tab 2 content"}</TabPanel>
        <TabPanel value="tab3">{"Tab 3 content"}</TabPanel>
      </Tabs>
    )

    cy.get("#tab1-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")
  })

  it("Tabs can be toggled with a mouse click", () => {
    cy.mount(
      <Tabs defaultValue="tab1">
        <TabHeaders>
          <TabHeader value="tab1">{"Tab 1"}</TabHeader>
          <TabHeader value="tab2">{"Tab 2"}</TabHeader>
          <TabHeader value="tab3">{"Tab 3"}</TabHeader>
        </TabHeaders>
        <TabPanel value="tab1">{"Tab 1 content"}</TabPanel>
        <TabPanel value="tab2">{"Tab 2 content"}</TabPanel>
        <TabPanel value="tab3">{"Tab 3 content"}</TabPanel>
      </Tabs>
    )

    cy.get("#tab2-tab").click()
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")

    cy.get("#tab3-tab").click()
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("be.visible")

    cy.get("#tab1-tab").click()
    cy.get("#tab1-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")
  })

  it("Tabs can be toggled with arrow keys", () => {
    cy.mount(
      <Tabs defaultValue="tab1">
        <TabHeaders>
          <TabHeader value="tab1">{"Tab 1"}</TabHeader>
          <TabHeader value="tab2">{"Tab 2"}</TabHeader>
          <TabHeader value="tab3">{"Tab 3"}</TabHeader>
        </TabHeaders>
        <TabPanel value="tab1">{"Tab 1 content"}</TabPanel>
        <TabPanel value="tab2">{"Tab 2 content"}</TabPanel>
        <TabPanel value="tab3">{"Tab 3 content"}</TabPanel>
      </Tabs>
    )

    // Navigate to the right

    cy.get("#tab1-tab").focus()
    cy.get("#tab1-tab").type("{rightarrow}")
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")

    cy.get("#tab2-tab").focus()
    cy.get("#tab2-tab").type("{rightarrow}")
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("be.visible")

    // Check that going left when already on last tab doesn't do anything
    cy.get("#tab3-tab").focus()
    cy.get("#tab3-tab").type("{rightarrow}")
    cy.get("#tab3-tab").should("be.focused")
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("be.visible")

    // Navigate to the left

    cy.get("#tab3-tab").focus()
    cy.get("#tab3-tab").type("{leftarrow}")
    cy.get("#tab1-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("not.be.visible")
    cy.get("#tab2-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")

    cy.get("#tab2-tab").focus()
    cy.get("#tab2-tab").type("{leftarrow}")
    cy.get("#tab1-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")

    // Check that going left when already on last tab doesn't do anything
    cy.get("#tab1-tab").focus()
    cy.get("#tab1-tab").type("{leftarrow}")
    cy.get("#tab1-tab").should("be.focused")
    cy.get("#tab1-tab").parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab1-panel").should("be.visible")
    cy.get("#tab2-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab2-panel").should("not.be.visible")
    cy.get("#tab3-tab").parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get("#tab3-panel").should("not.be.visible")
  })
})
