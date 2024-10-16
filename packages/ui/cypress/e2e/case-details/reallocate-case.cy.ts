import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import canReallocateTestData from "../../fixtures/canReallocateTestData.json"
import { clickTab, loginAndVisit } from "../../support/helpers"

describe("Case details", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should be able to reallocate a case is visible to the user and not locked by another user", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit()

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.contains("H2", "Case reallocation").should("exist")

    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get('textarea[name="note"]').type("This is a dummy note")
    cy.get("span").should("contain", "You have 1980 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    loginAndVisit("BichardForce03")
    cy.findByText("NAME Defendant").click()

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 3)
    cy.get("table tbody tr:visible").should(
      "contain",
      "GeneralHandler: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "GeneralHandler: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr:visible").should("contain", "This is a dummy note")
  })

  it("Should be able to reallocate a case without note", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit()

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.contains("H2", "Case reallocation").should("exist")
    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get("span").should("contain", "You have 2000 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    loginAndVisit("BichardForce03")
    cy.findByText("NAME Defendant").click()

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 2)
    cy.get("table tbody tr:visible").should(
      "contain",
      "GeneralHandler: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "GeneralHandler: Case reallocated to new force owner: 03YZ00")
  })

  it("Should not accept more than 2000 characters in note text field", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit()

    cy.findByText("NAME Defendant").click()

    cy.get("button").contains("Reallocate Case").click()
    cy.contains("H2", "Case reallocation").should("exist")
    cy.findByText("Cancel").should("have.attr", "href", "/bichard/court-cases/0")

    cy.get('select[name="force"]').select("03 - Cumbria")
    cy.get('textarea[name="note"]').then((element) => {
      element[0].textContent = "a".repeat(990)
    })
    cy.get('textarea[name="note"]').type("a".repeat(20))

    cy.get("span").should("contain", "You have 990 characters remaining")
    cy.get("button").contains("Reallocate").click()

    cy.get("H1").should("have.text", "Case list")
    cy.contains("NAME Defendant").should("not.exist")

    loginAndVisit("BichardForce03")
    cy.findByText("NAME Defendant").click()

    clickTab("Notes")

    cy.get("table tbody tr:visible").should("have.length", 3)
    cy.get("table tbody tr:visible").should(
      "contain",
      "GeneralHandler: Portal Action: Update Applied. Element: forceOwner. New Value: 03"
    )
    cy.get("table tbody tr:visible").should("contain", "GeneralHandler: Case reallocated to new force owner: 03YZ00")
    cy.get("table tbody tr:visible").should("not.contain", "a".repeat(2001))
    cy.get("table tbody tr:visible").should("contain", "a".repeat(1010))
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1/notes/reallocate"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  canReallocateTestData.forEach(
    ({ canReallocate, triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
      it(`should return 200 when triggers are ${triggers} and ${
        triggersLockedByAnotherUser ? "" : "NOT"
      } locked by another user, and exceptions are ${exceptions} and ${
        exceptionLockedByAnotherUser ? "" : "NOT"
      } locked by another user`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            triggerStatus: triggers,
            errorStatus: exceptions,
            triggersLockedByAnotherUser: triggersLockedByAnotherUser ? "BichardForce03" : null,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "BichardForce03" : null
          }
        ])

        loginAndVisit("/bichard/court-cases/0")

        cy.get("button.b7-reallocate-button").should(canReallocate ? "exist" : "not.exist")

        cy.request({
          failOnStatusCode: false,
          url: "/bichard/court-cases/0/reallocate"
        }).then((response) => {
          expect(response.status).to.eq(canReallocate ? 200 : 403)
        })
      })
    }
  )

  it("Should not allow reallocating phase 2 cases", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", phase: 1 },
      { orgForPoliceFilter: "01", phase: 2 }
    ])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".govuk-tag:visible")
      .contains(
        "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
      )
      .should("not.exist")

    cy.visit("/bichard/court-cases/1")

    cy.get(".govuk-tag")
      .contains(
        "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
      )
      .should("exist")

    cy.visit("/bichard/court-cases/1/reallocate")
    cy.url().should("match", /\/court-cases\/\d+/)
  })

  it('should display the most recent user note when "show more" is visible', () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "another.user1",
            text: "Test note 1"
          },
          {
            user: "another.user2",
            text: "Test note 2"
          }
        ]
      ],
      force: "01"
    })

    loginAndVisit("/bichard/court-cases/0")
    cy.get("button").contains("Reallocate Case").click()

    cy.contains("Another User2")
    cy.contains("Test note 2")

    cy.contains("Another User1").should("not.exist")
    cy.contains("Test note 1").should("not.exist")
  })

  it("should display the force code of the note user", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "another.user",
            text: "Test note"
          }
        ]
      ],
      force: "01"
    })

    loginAndVisit("/bichard/court-cases/0")
    cy.get("button").contains("Reallocate Case").click()

    cy.contains("Another User")
    cy.contains("Test note")
    cy.contains("(01)")
  })

  it("should not display system notes", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "System",
            text: "Test note 1"
          },
          {
            user: "another.user2",
            text: "Test note 2"
          }
        ]
      ],
      force: "01"
    })

    loginAndVisit("/bichard/court-cases/0")
    cy.get("button").contains("Reallocate Case").click()

    cy.contains("Another User2")
    cy.contains("Test note 2")

    cy.contains("System").should("not.exist")
    cy.contains("Test note 1").should("not.exist")
  })

  it('should display all user notes when "show less" is visible', () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          {
            user: "another.user1",
            text: "Test note 1"
          },
          {
            user: "another.user2",
            text: "Test note 2"
          }
        ]
      ],
      force: "01"
    })

    loginAndVisit("/bichard/court-cases/0")
    cy.get("button").contains("Reallocate Case").click()
    cy.get("button").contains("show more").click()

    cy.contains("Another User2")
    cy.contains("Test note 2")

    cy.contains("Another User1")
    cy.contains("Test note 1")

    cy.get("button").contains("show less").click()

    cy.contains("Another User1").should("not.exist")
    cy.contains("Test note 1").should("not.exist")
  })
})

export {}
