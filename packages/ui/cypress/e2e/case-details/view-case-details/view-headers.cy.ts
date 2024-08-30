import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { loginAndVisit } from "../../../support/helpers"

describe("View court case details header", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should have a leave and lock button that returns to the case list when the case is locked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "TriggerHandler",
        orgForPoliceFilter: "01"
      }
    ])
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0010,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
    })

    loginAndVisit("TriggerHandler")
    cy.get(".locked-by-tag").should("have.text", "Trigger Handler User")
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-lock")
      .should("have.text", "Leave and lock")
      .parent()
      .should("have.attr", "href", "/bichard")
    cy.get("button#leave-and-lock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("have.text", "Trigger Handler User")
  })

  it("should have a return to case list button that returns to the case list when the case isn't locked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "Supervisor",
        orgForPoliceFilter: "01"
      }
    ])

    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get("button#leave-and-lock").should("not.exist")
    cy.get("button#leave-and-unlock").should("not.exist")
    cy.get("button#return-to-case-list").should("exist").should("have.text", "Return to case list")
    cy.get("button#return-to-case-list").click()
    cy.location("pathname").should("equal", "/bichard")
  })

  it("should have a leave and unlock button that unlocks the triggers when you have the triggers locked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "TriggerHandler",
        orgForPoliceFilter: "01"
      }
    ])
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0010,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
    })

    loginAndVisit("TriggerHandler")
    cy.get(".locked-by-tag").should("have.text", "Trigger Handler User")
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-unlock").should("exist").should("have.text", "Leave and unlock")
    cy.get("button#leave-and-unlock")
      .parent("form")
      .should("exist")
      .should("have.attr", "action", "/bichard?unlockTrigger=0")
      .should("have.attr", "method", "post")

    cy.get("button#leave-and-unlock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("not.exist")
  })

  it("should have a leave and unlock button that unlocks both triggers and exceptions when both triggers and exceptions are locked", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "GeneralHandler",
        errorLockedByUsername: "GeneralHandler",
        orgForPoliceFilter: "01"
      }
    ])
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0010,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
    })

    loginAndVisit()
    cy.get(".locked-by-tag").filter(':contains("General Handler User")').should("have.length", 2)
    cy.get("td a").contains("NAME Defendant").click()
    cy.location("pathname").should("equal", "/bichard/court-cases/0")

    cy.get("button#leave-and-unlock").should("exist").should("have.text", "Leave and unlock")
    cy.get("button#leave-and-unlock")
      .parent("form")
      .should("exist")
      .should("have.attr", "action", "/bichard?unlockException=0&unlockTrigger=0")
      .should("have.attr", "method", "post")

    cy.get("button#leave-and-unlock").click()
    cy.location("pathname").should("equal", "/bichard")
    cy.get(".locked-by-tag").should("not.exist")
  })

  describe("View only badge", () => {
    it("Should show a view only badge on a case that someone else has locked", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: "Supervisor",
          triggerLockedByUsername: "Supervisor",
          isUrgent: false,
          orgForPoliceFilter: "01"
        }
      ])

      loginAndVisit("TriggerHandler", "/bichard/court-cases/0")
      cy.get(".view-only-badge").contains("View only").should("exist").should("be.visible")
    })

    it("Should not show a view only badge on a case where we have both locks", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: "TriggerHandler",
          triggerLockedByUsername: "TriggerHandler",
          isUrgent: false,
          orgForPoliceFilter: "01"
        }
      ])

      loginAndVisit("TriggerHandler", "/bichard/court-cases/0")
      cy.get(".view-only-badge").should("not.exist")
    })

    it("Should not show a view only badge on a case where we have one lock and nobody holds the other lock", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: "TriggerHandler",
          isUrgent: false,
          orgForPoliceFilter: "01"
        }
      ])

      loginAndVisit("TriggerHandler", "/bichard/court-cases/0")
      cy.get(".view-only-badge").should("not.exist")
    })

    it("Should not show a view only badge on a case where we have one lock and somebody else holds the other lock", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: "Supervisor",
          triggerLockedByUsername: "TriggerHandler",
          isUrgent: false,
          orgForPoliceFilter: "01"
        }
      ])

      loginAndVisit("TriggerHandler", "/bichard/court-cases/0")
      cy.get(".view-only-badge").should("not.exist")
    })
  })

  describe("Case locks", () => {
    describe("General handler and supervisor view", () => {
      it("When we have both locks, it shows both lock components as locked to us", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: "GeneralHandler",
            triggerLockedByUsername: "GeneralHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("GeneralHandler", "/bichard/court-cases/0")
        cy.get(".exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
        cy.get(".triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
      })

      it("When we have one lock and someone else has the other, it shows both lock components correctly", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: "GeneralHandler",
            triggerLockedByUsername: "TriggerHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("GeneralHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")

        cy.get(".triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Trigger Handler User")
      })

      it("When someone else has both locks, it shows both lock components correctly", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: "TriggerHandler",
            triggerLockedByUsername: "TriggerHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("GeneralHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Trigger Handler User")

        cy.get(".triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Trigger Handler User")
      })
    })

    describe("Trigger handler view", () => {
      it("When we have the triggers locked, it shows only the trigger lock", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            triggerLockedByUsername: "TriggerHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("not.exist")
        cy.get(".triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "Locked to you")
      })

      it("When somebody else has the triggers locked, it shows only the trigger lock", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            triggerLockedByUsername: "GeneralHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("not.exist")
        cy.get(".triggers-locked-tag").should("exist")
        cy.get("#triggers-locked-tag-lockee").should("contain.text", "General Handler User")
      })
    })

    describe("Exception handler view", () => {
      it("When we have the exceptions locked, it shows only the exception lock", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: "ExceptionHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("ExceptionHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "Locked to you")
        cy.get(".triggers-locked-tag").should("not.exist")
      })

      it("When somebody else has the exceptions locked, it shows only the exception lock", () => {
        cy.task("insertCourtCasesWithFields", [
          {
            errorLockedByUsername: "GeneralHandler",
            orgForPoliceFilter: "01"
          }
        ])

        loginAndVisit("ExceptionHandler", "/bichard/court-cases/0")

        cy.get(".exceptions-locked-tag").should("exist")
        cy.get("#exceptions-locked-tag-lockee").should("contain.text", "General Handler User")
        cy.get(".triggers-locked-tag").should("not.exist")
      })
    })
  })
})
