import { TabHeader, TabHeaders, TabPanel, Tabs } from "../../src/components/Tabs"

describe("Tabs", () => {
  function tabShouldBeActive(tabNumber: number) {
    cy.get(`#tab${tabNumber}-tab`).parent().should("have.class", "govuk-tabs__list-item--selected")
    cy.get(`#tab${tabNumber}-panel`).should("be.visible")
  }

  function tabShouldBeInactive(tabNumber: number) {
    cy.get(`#tab${tabNumber}-tab`).parent().should("not.have.class", "govuk-tabs__list-item--selected")
    cy.get(`#tab${tabNumber}-panel`).should("not.be.visible")
  }

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

    tabShouldBeActive(1)
    tabShouldBeInactive(2)
    tabShouldBeInactive(3)
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
    tabShouldBeInactive(1)
    tabShouldBeActive(2)
    tabShouldBeInactive(3)

    cy.get("#tab3-tab").click()
    tabShouldBeInactive(1)
    tabShouldBeInactive(2)
    tabShouldBeActive(3)

    cy.get("#tab1-tab").click()
    tabShouldBeActive(1)
    tabShouldBeInactive(2)
    tabShouldBeInactive(3)
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
    tabShouldBeInactive(1)
    tabShouldBeActive(2)
    tabShouldBeInactive(3)

    cy.get("#tab2-tab").focus()
    cy.get("#tab2-tab").type("{rightarrow}")
    tabShouldBeInactive(1)
    tabShouldBeInactive(2)
    tabShouldBeActive(3)

    // Check that going left when already on last tab doesn't do anything
    cy.get("#tab3-tab").focus()
    cy.get("#tab3-tab").type("{rightarrow}")
    cy.get("#tab3-tab").should("be.focused")
    tabShouldBeInactive(1)
    tabShouldBeInactive(2)
    tabShouldBeActive(3)

    // Navigate to the left

    cy.get("#tab3-tab").focus()
    cy.get("#tab3-tab").type("{leftarrow}")
    tabShouldBeInactive(1)
    tabShouldBeActive(2)
    tabShouldBeInactive(3)

    cy.get("#tab2-tab").focus()
    cy.get("#tab2-tab").type("{leftarrow}")
    tabShouldBeActive(1)
    tabShouldBeInactive(2)
    tabShouldBeInactive(3)

    // Check that going left when already on last tab doesn't do anything
    cy.get("#tab1-tab").focus()
    cy.get("#tab1-tab").type("{leftarrow}")
    cy.get("#tab1-tab").should("be.focused")
    tabShouldBeActive(1)
    tabShouldBeInactive(2)
    tabShouldBeInactive(3)
  })

  it("Calls the onTabsChanged callback", () => {
    const onTabChanged = cy.spy().as("onTabChanged")

    cy.mount(
      <Tabs defaultValue="tab1" onTabChanged={onTabChanged}>
        <TabHeaders>
          <TabHeader value="tab1">{"Tab 1"}</TabHeader>
          <TabHeader value="tab2">{"Tab 2"}</TabHeader>
        </TabHeaders>
        <TabPanel value="tab1">{"Tab 1 content"}</TabPanel>
        <TabPanel value="tab2">{"Tab 2 content"}</TabPanel>
      </Tabs>
    )

    cy.get("#tab2-tab").click()
    cy.get("@onTabChanged").should("be.called")
  })
})
