import { loginAndVisit } from "../../support/helpers"

const checkCasesOrder = (expectedOrder: number[]) => {
  cy.get("tbody td:nth-child(5)")
    .should("have.length", expectedOrder.length)
    .should((elems) => {
      const actualOrder = elems.toArray().map((el) => el.innerText)
      expect(actualOrder).to.deep.equal(expectedOrder.map((item) => `Case0000${item}`))
    })
}

const checkPtiurnOrder = (expectedOrder: string[]) => {
  cy.get("tbody td:nth-child(5)")
    .should("have.length", expectedOrder.length)
    .should((elems) => {
      const actualOrder = elems.toArray().map((el) => el.innerText)
      expect(actualOrder).to.deep.equal(expectedOrder)
    })
}

describe("Sorting cases", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should default to sorting by court date", () => {
    const courtDates = [new Date("09/12/2021"), new Date("04/01/2022"), new Date("01/07/2020")]
    cy.task("insertCourtCasesWithFields", [
      ...courtDates.map((courtDate) => ({
        courtDate: courtDate,
        defendantName: "WAYNE Bruce",
        orgForPoliceFilter: "011111"
      })),
      ...courtDates.map((courtDate) => ({
        courtDate: courtDate,
        defendantName: "PENNYWORTH Alfred",
        orgForPoliceFilter: "011111"
      }))
    ])

    loginAndVisit()

    // Sorted by court date
    checkCasesOrder([1, 4, 0, 3, 2, 5])
  })

  it("can display cases ordered by court name", () => {
    cy.task("insertCourtCasesWithFields", [
      { courtName: "BBBB", orgForPoliceFilter: "011111" },
      { courtName: "AAAA", orgForPoliceFilter: "011111" },
      { courtName: "DDDD", orgForPoliceFilter: "011111" },
      { courtName: "CCCC", orgForPoliceFilter: "011111" }
    ])

    loginAndVisit()

    cy.get("#court-name-sort").find(".unorderedArrow").click()
    cy.get("#court-name-sort").get(".upArrow").should("exist")

    cy.get("tr.caseDetailsRow").first().get("td:nth-child(4)").contains("AAAA")
    cy.get("tr.caseDetailsRow").last().get("td:nth-child(4)").contains("DDDD")

    cy.get("#court-name-sort").click()
    cy.get("#court-name-sort").get(".downArrow").should("exist")

    cy.get("tr.caseDetailsRow").first().get("td:nth-child(4)").contains("DDDD")
    cy.get("tr.caseDetailsRow").last().get("td:nth-child(4)").contains("AAAA")
  })

  it("Should use court date as a secondary sort when sorting by other fields", () => {
    const courtDates = [new Date("09/12/2021"), new Date("04/01/2022"), new Date("01/07/2020")]
    cy.task("insertCourtCasesWithFields", [
      ...courtDates.map((courtDate) => ({
        courtDate: courtDate,
        defendantName: "WAYNE Bruce",
        orgForPoliceFilter: "011111"
      })),
      ...courtDates.map((courtDate) => ({
        courtDate: courtDate,
        defendantName: "PENNYWORTH Alfred",
        orgForPoliceFilter: "011111"
      }))
    ])

    loginAndVisit()

    // Sort ascending by defendant name
    cy.get("#defendant-name-sort").click()

    checkCasesOrder([4, 3, 5, 1, 0, 2])
  })

  it("Should sort by court name", () => {
    const courtNames = ["DDDD", "AAAA", "CCCC", "BBBB"]
    cy.task(
      "insertCourtCasesWithFields",
      courtNames.map((courtName) => ({
        courtName: courtName,
        orgForPoliceFilter: "011111"
      }))
    )

    loginAndVisit()

    // Sort ascending by court name
    cy.get("#court-name-sort").click()
    checkCasesOrder([1, 3, 2, 0])

    // Sort descending by court name
    cy.get("#court-name-sort").find(".upArrow").click()
    checkCasesOrder([0, 2, 3, 1])

    cy.get("#court-name-sort").find(".downArrow").click()
    checkCasesOrder([1, 3, 2, 0])
  })

  it("Should sort by PTIURN", () => {
    const PTIURNs = ["01009940223", "05003737622", "03001976220", "04007638323"]
    const ascending = [...PTIURNs].sort()
    const descending = [...PTIURNs].sort().reverse()

    cy.task(
      "insertCourtCasesWithFields",
      PTIURNs.map((PTIURN) => ({
        ptiurn: PTIURN,
        orgForPoliceFilter: "011111"
      }))
    )

    loginAndVisit()

    // Sort ascending by PTIURN
    cy.get("#ptiurn-sort").find(".unorderedArrow").click()
    checkPtiurnOrder(ascending)

    // Sort descending by PTIURN
    cy.get("#ptiurn-sort").find(".upArrow").click()
    checkPtiurnOrder(descending)
  })
})
