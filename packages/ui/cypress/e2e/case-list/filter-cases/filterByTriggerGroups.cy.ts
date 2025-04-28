import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { flatten } from "lodash"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("Filtering cases by trigger groups", () => {
  beforeEach(() => {
    cy.loginAs("userWithoutExcludedTriggers")
  })

  it("Should be accessible with trigger group is unchecked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").should("not.be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is checked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#bails").should("be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is indeterminate", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#trpr0008").click()
    cy.get("input#bails:indeterminate").should("exist")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("should show reason codes in the reason codes input when we click on Bails", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get("input#reasonCodes").should("value", "PR08 PR10 PR19 PR30")
  })

  it("should show reason codes in the reason codes input when we click on Results", () => {
    cy.visit("/bichard")

    cy.get("input#results").should("exist")
    cy.get("input#results").click()

    cy.get("input#reasonCodes").should("value", "PR06 PR16 PR20 PR25")
  })

  it("should show reason codes in the reason codes input when we click on Custody", () => {
    cy.visit("/bichard")

    cy.get("input#custody").should("exist")
    cy.get("input#custody").click()

    cy.get("input#reasonCodes").should("value", "PR05")
  })

  it("should show reason codes in the reason codes input when we click on Orders", () => {
    cy.visit("/bichard")

    cy.get("input#orders").should("exist")
    cy.get("input#orders").click()

    cy.get("input#reasonCodes").should("value", "PR03 PS08 PR21 PR26 PR29")
  })

  it("should show reason codes in the reason codes input when we click on Warrants", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get("input#reasonCodes").should("value", "PR02 PR12")
  })

  it("should show reason codes filter chips when we click on a trigger group", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".moj-filter__tag").contains("PR02")
    cy.get(".moj-filter__tag").contains("PR12")
  })

  describe("when using the group checkboxes", () => {
    before(() => {
      cy.task("clearCourtCases")

      // Add 20 cases
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "WAYNE Bruce", orgForPoliceFilter: "18" },
        { defendantName: "GORDON Barbara", orgForPoliceFilter: "18" },
        { defendantName: "PENNYWORTH Alfred", orgForPoliceFilter: "18" },
        { defendantName: "GRAYSON Richard", orgForPoliceFilter: "18" },
        { defendantName: "SAVAGE Pete", orgForPoliceFilter: "18" },
        { defendantName: "FALCONE Carmine", orgForPoliceFilter: "18" },
        { defendantName: "GORDON James", orgForPoliceFilter: "18" },
        { defendantName: "COLSON Gil", orgForPoliceFilter: "18" },
        { defendantName: "KYKLE Selina", orgForPoliceFilter: "18" },
        { defendantName: "COOPER Harriet", orgForPoliceFilter: "18" },
        { defendantName: "REID Britt", orgForPoliceFilter: "18" },
        { defendantName: "BENNETT Ethan", orgForPoliceFilter: "18" },
        { defendantName: "ROJAS Angel", orgForPoliceFilter: "18" },
        { defendantName: "YIN Ellen", orgForPoliceFilter: "18" },
        { defendantName: "KARLO Basil", orgForPoliceFilter: "18" },
        { defendantName: "GRAVES Mercy", orgForPoliceFilter: "18" },
        { defendantName: "GREY Francis", orgForPoliceFilter: "18" },
        { defendantName: "QUINN Harley", orgForPoliceFilter: "18" },
        { defendantName: "KATSU Hideto", orgForPoliceFilter: "18" },
        { defendantName: "LUTHOR Lex", orgForPoliceFilter: "18" }
      ])

      // Assign 16 cases with the group trigger code (Bails, Results, Custody, Orders, Warrants)
      flatten(Object.values(GroupedTriggerCodes)).forEach((triggerCode, index) => {
        const trigger: TestTrigger = {
          triggerId: index,
          triggerCode,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }

        cy.task("insertTriggers", { caseId: index, triggers: [trigger] })
      })

      // The last 4 cases should not have Bails, Results, Custody, Orders or Warrants trigger code
      const courtCasesIds = [16, 17, 18, 19]
      courtCasesIds.forEach((courtCasesId) => {
        const trigger: TestTrigger = {
          triggerId: courtCasesId,
          triggerCode: TriggerCode.TRPR0017,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }

        cy.task("insertTriggers", { caseId: courtCasesId, triggers: [trigger] })
      })
    })

    after(() => {
      cy.task("clearTriggers")
    })

    it("shows all cases before we filter them and the short trigger and description", () => {
      cy.visit("/bichard")

      cy.get("tbody").should("have.length", "20")

      // Bails
      cy.get("table tbody:nth-child(2)").within(() => {
        cy.get(".defendant-name").contains("WAYNE Bruce")
        cy.get(".trigger-description").contains("PR08 - Breach of bail")
      })
      cy.get("table tbody:nth-child(3)").within(() => {
        cy.get(".defendant-name").contains("GORDON Barbara")
        cy.get(".trigger-description").contains("PR10 - Conditional bail")
      })
      cy.get("table tbody:nth-child(4)").within(() => {
        cy.get(".defendant-name").contains("PENNYWORTH Alfred")
        cy.get(".trigger-description").contains("PR19 - Bail direction")
      })
      cy.get("table tbody:nth-child(5)").within(() => {
        cy.get(".defendant-name").contains("GRAYSON Richard")
        cy.get(".trigger-description").contains("PR30 - Pre-charge bail application")
      })

      // Results
      cy.get("table tbody:nth-child(6)").within(() => {
        cy.get(".defendant-name").contains("SAVAGE Pete")
        cy.get(".trigger-description").contains("PR06 - Imprisoned")
      })
      cy.get("table tbody:nth-child(7)").within(() => {
        cy.get(".defendant-name").contains("FALCONE Carmine")
        cy.get(".trigger-description").contains("PR16 - Forfeiture order")
      })
      cy.get("table tbody:nth-child(8)").within(() => {
        cy.get(".defendant-name").contains("GORDON James")
        cy.get(".trigger-description").contains("PR20 - Breach")
      })
      cy.get("table tbody:nth-child(9)").within(() => {
        cy.get(".defendant-name").contains("COLSON Gil")
        cy.get(".trigger-description").contains("PR25 - Case reopened")
      })

      // Custody
      cy.get("table tbody:nth-child(10)").within(() => {
        cy.get(".defendant-name").contains("KYKLE Selina")
        cy.get(".trigger-description").contains("PR05 - Remand in custody")
      })

      // Orders
      cy.get("table tbody:nth-child(11)").within(() => {
        cy.get(".defendant-name").contains("COOPER Harriet")
        cy.get(".trigger-description").contains("PR03 - Order issues")
      })
      cy.get("table tbody:nth-child(12)").within(() => {
        cy.get(".defendant-name").contains("REID Britt")
        cy.get(".trigger-description").contains("PS08 - Curfew order")
      })
      cy.get("table tbody:nth-child(13)").within(() => {
        cy.get(".defendant-name").contains("BENNETT Ethan")
        cy.get(".trigger-description").contains("PR21 - Disq. non-motoring")
      })
      cy.get("table tbody:nth-child(14)").within(() => {
        cy.get(".defendant-name").contains("ROJAS Angel")
        cy.get(".trigger-description").contains("PR26 - Disq. Suspended")
      })
      cy.get("table tbody:nth-child(15)").within(() => {
        cy.get(".defendant-name").contains("YIN Ellen")
        cy.get(".trigger-description").contains("PR29 - Civil Proceedings")
      })

      // Warrants
      cy.get("table tbody:nth-child(16)").within(() => {
        cy.get(".defendant-name").contains("KARLO Basil")
        cy.get(".trigger-description").contains("PR02 - Warrant issued")
      })
      cy.get("table tbody:nth-child(17)").within(() => {
        cy.get(".defendant-name").contains("GRAVES Mercy")
        cy.get(".trigger-description").contains("PR12 - Warrant withdrawn")
      })

      // Other
      cy.get("table tbody:nth-child(18)").within(() => {
        cy.get(".defendant-name").contains("GREY Francis")
        cy.get(".trigger-description").contains("PR17 - Adjourned sine die")
      })
      cy.get("table tbody:nth-child(19)").within(() => {
        cy.get(".defendant-name").contains("QUINN Harley")
        cy.get(".trigger-description").contains("PR17 - Adjourned sine die")
      })
      cy.get("table tbody:nth-child(20)").within(() => {
        cy.get(".defendant-name").contains("KATSU Hideto")
        cy.get(".trigger-description").contains("PR17 - Adjourned sine die")
      })
      cy.get("table tbody:nth-child(21)").within(() => {
        cy.get(".defendant-name").contains("LUTHOR Lex")
        cy.get(".trigger-description").contains("PR17 - Adjourned sine die")
      })
    })

    it("filters by group 'Bails'", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()
      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "4")

      cy.get("tbody").contains("WAYNE Bruce")
      cy.get("tbody").contains("GORDON Barbara")
      cy.get("tbody").contains("PENNYWORTH Alfred")
      cy.get("tbody").contains("GRAYSON Richard")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Bails' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()

      cy.get("input#trpr0010").click()
      cy.get("input#trpr0010").should("not.be.checked")
      cy.get("input#trpr0019").click()
      cy.get("input#trpr0019").should("not.be.checked")
      cy.get("input#trpr0030").click()
      cy.get("input#trpr0030").should("not.be.checked")

      cy.get("input#bails:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("WAYNE Bruce")

      cy.get("tbody").contains("GORDON Barbara").should("not.exist")
      cy.get("tbody").contains("PENNYWORTH Alfred").should("not.exist")
      cy.get("tbody").contains("GRAYSON Richard").should("not.exist")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Results'", () => {
      cy.visit("/bichard")

      cy.get("input#results").click()
      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "4")

      cy.get("tbody").contains("SAVAGE Pete")
      cy.get("tbody").contains("FALCONE Carmine")
      cy.get("tbody").contains("GORDON James")
      cy.get("tbody").contains("COLSON Gil")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Results' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#results").click()

      cy.get("input#trpr0016").click()
      cy.get("input#trpr0016").should("not.be.checked")
      cy.get("input#trpr0020").click()
      cy.get("input#trpr0020").should("not.be.checked")
      cy.get("input#trpr0025").click()
      cy.get("input#trpr0025").should("not.be.checked")

      cy.get("input#results:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("SAVAGE Pete")

      cy.get("tbody").contains("FALCONE Carmine").should("not.exist")
      cy.get("tbody").contains("GORDON James").should("not.exist")
      cy.get("tbody").contains("COLSON Gil").should("not.exist")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Custody'", () => {
      cy.visit("/bichard")

      cy.get("input#custody").click()
      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("KYKLE Selina")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Orders'", () => {
      cy.visit("/bichard")

      cy.get("input#orders").click()
      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "5")

      cy.get("tbody").contains("COOPER Harriet")
      cy.get("tbody").contains("REID Britt")
      cy.get("tbody").contains("BENNETT Ethan")
      cy.get("tbody").contains("ROJAS Angel")
      cy.get("tbody").contains("YIN Ellen")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Orders' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#orders").click()

      cy.get("input#trps0008").click()
      cy.get("input#trps0008").should("not.be.checked")
      cy.get("input#trpr0021").click()
      cy.get("input#trpr0021").should("not.be.checked")
      cy.get("input#trpr0026").click()
      cy.get("input#trpr0026").should("not.be.checked")
      cy.get("input#trpr0029").click()
      cy.get("input#trpr0029").should("not.be.checked")

      cy.get("input#orders:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("COOPER Harriet")

      cy.get("tbody").contains("REID Britt").should("not.exist")
      cy.get("tbody").contains("BENNETT Ethan").should("not.exist")
      cy.get("tbody").contains("ROJAS Angel").should("not.exist")
      cy.get("tbody").contains("YIN Ellen").should("not.exist")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Warrants'", () => {
      cy.visit("/bichard")

      cy.get("input#warrants").click()
      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "2")

      cy.get("tbody").contains("KARLO Basil")
      cy.get("tbody").contains("GRAVES Mercy")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Warrants' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#warrants").click()

      cy.get("input#trpr0012").click()
      cy.get("input#trpr0012").should("not.be.checked")

      cy.get("input#warrants:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("KARLO Basil")

      cy.get("tbody").contains("GRAVES Mercy").should("not.exist")

      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by all trigger groups", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()
      cy.get("input#results").click()
      cy.get("input#custody").click()
      cy.get("input#orders").click()
      cy.get("input#warrants").click()

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "16")

      // Bails
      cy.get("tbody").contains("WAYNE Bruce")
      cy.get("tbody").contains("GORDON Barbara")
      cy.get("tbody").contains("PENNYWORTH Alfred")
      cy.get("tbody").contains("GRAYSON Richard")
      // Results
      cy.get("tbody").contains("SAVAGE Pete")
      cy.get("tbody").contains("FALCONE Carmine")
      cy.get("tbody").contains("GORDON James")
      cy.get("tbody").contains("COLSON Gil")
      // Custody
      cy.get("tbody").contains("KYKLE Selina")
      // Orders
      cy.get("tbody").contains("COOPER Harriet")
      cy.get("tbody").contains("REID Britt")
      cy.get("tbody").contains("BENNETT Ethan")
      cy.get("tbody").contains("ROJAS Angel")
      cy.get("tbody").contains("YIN Ellen")
      // Warrants
      cy.get("tbody").contains("KARLO Basil")
      cy.get("tbody").contains("GRAVES Mercy")
      // Other
      cy.get("tbody").contains("GREY Francis").should("not.exist")
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })
  })
})
