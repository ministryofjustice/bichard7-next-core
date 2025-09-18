import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "components/Table"

describe("Table", () => {
  it("mounts", () => {
    cy.mount(<Table></Table>)

    cy.get("table").should("exist")
  })

  it("renders children", () => {
    cy.mount(
      <Table>
        <TableHead></TableHead>
        <TableBody></TableBody>
      </Table>
    )

    cy.get("table").should("exist")
    cy.get("thead").should("exist")
    cy.get("tbody").should("exist")
  })

  it("merges class names", () => {
    cy.mount(<Table className="extra-class"></Table>)

    cy.get("table").should("have.class", "govuk-table").should("have.class", "extra-class")
  })
})

describe("TableHead", () => {
  it("mounts", () => {
    cy.mount(<TableHead></TableHead>)

    cy.get("thead").should("exist").should("have.class", "govuk-table__head")
  })

  it("renders children", () => {
    cy.mount(
      <TableHead>
        <TableRow>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
    )

    cy.get("thead").should("exist")
    cy.get("tr").should("exist")
    cy.get("th").should("exist")
  })

  it("merges class names", () => {
    cy.mount(<TableHead className="extra-class"></TableHead>)

    cy.get("thead").should("have.class", "govuk-table__head").should("have.class", "extra-class")
  })
})

describe("TableBody", () => {
  it("mounts", () => {
    cy.mount(<TableBody></TableBody>)

    cy.get("tbody").should("exist").should("have.class", "govuk-table__body")
  })

  it("renders children", () => {
    cy.mount(
      <TableBody>
        <TableRow>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    )

    cy.get("tbody").should("exist")
    cy.get("tr").should("exist")
    cy.get("td").should("exist")
  })

  it("merges class names", () => {
    cy.mount(<TableBody className="extra-class"></TableBody>)
    cy.get("tbody").should("have.class", "govuk-table__body").should("have.class", "extra-class")
  })
})

describe("TableRow", () => {
  it("mounts", () => {
    cy.mount(<TableRow></TableRow>)

    cy.get("tr").should("exist").should("have.class", "govuk-table__row")
  })

  it("renders children", () => {
    cy.mount(
      <TableRow>
        <TableCell></TableCell>
      </TableRow>
    )

    cy.get("tr").should("exist")
    cy.get("td").should("exist")
  })

  it("merges class names", () => {
    cy.mount(<TableRow className="extra-class"></TableRow>)

    cy.get("tr").should("have.class", "govuk-table__row").should("have.class", "extra-class")
  })
})

describe("TableHeader", () => {
  it("mounts", () => {
    cy.mount(<TableHeader></TableHeader>)

    cy.get("th").should("exist").should("have.class", "govuk-table__header")
  })

  it("renders text", () => {
    cy.mount(<TableHeader>{"Text"}</TableHeader>)

    cy.get("th").should("contain.text", "Text")
  })

  it("merges class names", () => {
    cy.mount(<TableHeader className="extra-class"></TableHeader>)

    cy.get("th").should("have.class", "govuk-table__header").should("have.class", "extra-class")
  })
})

describe("TableCell", () => {
  it("mounts", () => {
    cy.mount(<TableCell></TableCell>)

    cy.get("td").should("exist").should("have.class", "govuk-table__cell")
  })

  it("renders text", () => {
    cy.mount(<TableCell>{"Text"}</TableCell>)

    cy.get("td").should("contain.text", "Text")
  })

  it("merges class names", () => {
    cy.mount(<TableCell className="extra-class"></TableCell>)

    cy.get("td").should("have.class", "govuk-table__cell").should("have.class", "extra-class")
  })
})
