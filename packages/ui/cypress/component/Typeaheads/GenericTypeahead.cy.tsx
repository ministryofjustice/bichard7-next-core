import { GenericTypeahead } from "@/components/Typeaheads/GenericTypeahead"

interface MockItem {
  id: string
  label: string
}

describe("GenericTypeahead Component", () => {
  const mockItems: MockItem[] = [
    { id: "1", label: "Alpha" },
    { id: "2", label: "Beta" },
    { id: "3", label: "Charlie" }
  ]

  beforeEach(() => {
    cy.intercept("GET", "/api/test-items*", (req) => {
      const url = new URL(req.url)
      const search = url.searchParams.get("q") ?? ""

      const filtered = mockItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))

      req.reply({
        statusCode: 200,
        body: filtered
      })
    }).as("fetchData")
  })

  it("renders with basic configurations passed via props", () => {
    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        name="test-name"
        placeholder="Search things..."
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <span>{item.label}</span>}
      />
    )

    cy.get("input#test-id")
      .should("be.visible")
      .and("have.attr", "name", "test-name")
      .and("have.attr", "placeholder", "Search things...")
  })

  it("debounces user input and displays filtered results", () => {
    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <>{item.label}</>}
      />
    )

    cy.wait("@fetchData")

    cy.get("input#test-id").type("Ch")

    cy.wait("@fetchData")

    cy.get("ul").children("li").should("have.length", 1)
    cy.contains("li", "Charlie").should("be.visible")
  })

  it("executes onSelectedItemChange callback when an option is selected", () => {
    const onSelectedStub = cy.stub().as("onSelected")

    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <>{item.label}</>}
        onSelectedItemChange={onSelectedStub}
      />
    )

    cy.get("input#test-id").type("Be")
    cy.wait("@fetchData")

    cy.contains("li", "Beta").click()
    cy.get("@onSelected").should("have.been.calledWith", mockItems[1])
  })

  it("executes onInputValueChange on typing", () => {
    const onInputValueChangeStub = cy.stub().as("onInputChange")

    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <>{item.label}</>}
        onInputValueChange={onInputValueChangeStub}
      />
    )

    cy.get("input#test-id").type("A")
    cy.get("@onInputChange").should("have.been.calledWith", "A")
  })

  it("intercepts state alterations via customBlurMatch", () => {
    const customBlurMatchStub = cy.stub().callsFake((typedValue, items: MockItem[]) => {
      const match = items.find((i) => i.label === typedValue)
      return match ? { selectedItem: match, inputValue: match.label } : null
    })

    const onSelectedStub = cy.stub().as("onSelected")

    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <>{item.label}</>}
        customBlurMatch={customBlurMatchStub}
        onSelectedItemChange={onSelectedStub}
      />
    )

    cy.get("input#test-id").type("Alpha")
    cy.wait("@fetchData")

    cy.get("input#test-id").blur()

    cy.wrap(customBlurMatchStub).should("have.been.called")
    cy.get("@onSelected").should("have.been.calledWith", mockItems[0])
  })

  it("applies processData transformations to network payloads before rendering", () => {
    const processDataTransformer = (data: MockItem[]) => {
      return data.map((item) => ({ ...item, label: item.label.toUpperCase() }))
    }

    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        processData={processDataTransformer}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <>{item.label}</>}
      />
    )

    cy.get("input#test-id").type("Alpha")
    cy.wait("@fetchData")

    cy.contains("li", "ALPHA").should("be.visible")
  })

  it("renders 'No results found' if search criteria return no results", () => {
    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        name="test-name"
        placeholder="Search things..."
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <span>{item.label}</span>}
      />
    )

    cy.get("input#test-id").type("not-matching search")

    cy.get("ul").children("li").should("have.length", 1)
    cy.contains("li", "No results found").should("be.visible")
  })

  it("renders 'This field is required' if showError is true", () => {
    cy.mount(
      <GenericTypeahead<MockItem>
        id="test-id"
        name="test-name"
        placeholder="Search things..."
        fetchUrlBuilder={(search) => `/api/test-items?q=${search}`}
        itemToString={(item) => item?.label ?? ""}
        getItemKey={(item, index) => `${item.id}-${index}`}
        renderItem={(item) => <span>{item.label}</span>}
        showError={true}
      />
    )

    cy.get("p.govuk-error-message").should("contain", "This field is required")
  })
})
