import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import DummyMultipleOffencesNoErrorAho from "../../../../test/test-data/AnnotatedHO1.json"
import DummyHO100200Aho from "../../../../test/test-data/HO100200_1.json"
import DummyHO100302Aho from "../../../../test/test-data/HO100302_1.json"
import dummyMultipleHearingResultsAho from "../../../../test/test-data/multipleHearingResultsOnOffence.json"
import type { TestTrigger } from "../../../../test/utils/manageTriggers"
import canReallocateTestData from "../../../fixtures/canReallocateTestData.json"
import a11yConfig from "../../../support/a11yConfig"
import { clickTab, loginAndVisit } from "../../../support/helpers"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("View case details", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should be accessible", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorCount: 0 }])
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

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should return 404 for a case that this user can not see", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 404 for a case that does not exist", () => {
    cy.loginAs("GeneralHandler")

    cy.request({
      failOnStatusCode: false,
      url: "/court-cases/1"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should return 401 if there is no auth token in the cookies(this will redirect to the user-service)", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01"
      }
    ])
    cy.loginAs("GeneralHandler")
    cy.request({
      failOnStatusCode: false,
      url: "/bichard/court-cases/0"
    }).then((response) => {
      expect(response.status).to.eq(200)
    })

    cy.clearCookies()
    cy.toBeUnauthorized("/bichard/court-cases/0")
  })

  it("Should load case details for the case that this user can see", () => {
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

    loginAndVisit("/bichard/court-cases/0")

    cy.contains("Case00000")
    cy.contains("Magistrates' Courts Essex Basildon")
  })

  it("Should allow to click through the tabs", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    clickTab("Defendant")
    cy.get("h2").contains("Defendant details")
    clickTab("Hearing")
    cy.get("h2").contains("Hearing details")
    clickTab("Case")
    cy.get("h2").contains("Case")
    clickTab("Offences")
    cy.get("h3").contains("Offences")
    clickTab("Notes")
    cy.get("h3").contains("Notes")
  })

  it("Should display the content of the Defendant tab", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
    loginAndVisit("/bichard/court-cases/0")

    clickTab("Defendant")
    cy.contains("dt", "ASN").siblings().contains("11/01ZD/01/448754K")
    cy.contains("dt", "PNC Check name").siblings().contains("SEXOFFENCE")
    cy.contains("dt", "Given name").siblings().contains("TRPRFOUR")
    cy.contains("dt", "Family name").siblings().contains("SEXOFFENCE")
    cy.contains("dt", "Title").siblings().contains("Mr")
    cy.contains("dt", "Date of birth").siblings().contains("11/11/1948")
    cy.contains("dt", "Gender").siblings().contains("1 (male)")

    cy.contains("dt", "Address")
      .siblings()
      .contains("Scenario1 Address Line 1")
      .siblings()
      .contains("Scenario1 Address Line 2")
      .siblings()
      .contains("Scenario1 Address Line 3")

    cy.contains("dt", "PNC file name").siblings().contains("SEXOFFENCE/TRPRFOUR")
    cy.contains("dt", "Remand status").siblings().contains("Unconditional bail")
    cy.get("h3").contains("Notes")
    cy.contains("dt", "Exclusion").siblings().contains("Exclusion: text describing exclusion")
    cy.contains("dt", "Other")
      .siblings()
      .contains("Other: not to go to the address of 11 Made Up street, Somewhere town")
    cy.contains("dt", "Residence")
      .siblings()
      .contains("Residence: live and sleep each night at 29 Made Up street, Another town")
    cy.contains("dt", "Curfew").siblings().contains("Curfew: curfew conditions")
    cy.contains("dt", "Bail reason").siblings().contains("to prevent offending")
  })

  it("Should display the content of the Case tab", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Case")
    cy.contains("dt", "PTIURN").siblings().contains("01ZD0303208")
    cy.contains("dt", "Force owner").siblings().contains("Metropolitan Police Service 01ZD00")
    cy.contains("dt", "Court case reference").siblings().contains("97/1626/008395Q")
    cy.contains("dt", "Court reference").siblings().contains("01ZD0303208")
    cy.contains("dt", "Notifiable to PNC").siblings().contains("Yes")
    cy.contains("dt", "Pre decision ind").siblings().contains("No")
  })

  it("Should display the content of the Hearing tab", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Hearing")
    cy.contains("dt", "Court location").siblings().contains("B01EF01")
    cy.contains("dt", "Date of hearing").siblings().contains("26/09/2011")
    cy.contains("dt", "Time of hearing").siblings().contains("10:00")
    cy.contains("dt", "Defendant present").siblings().contains("A")
    cy.contains("dt", "Source reference document name").siblings().contains("SPI TRPRFOUR SEXOFFENCE")
    cy.contains("dt", "Source reference identification").siblings().contains("CID-8bc6ee0a-46ac-4a0e-b9be-b03e3b041415")
    cy.contains("dt", "Source reference document type").siblings().contains("SPI Case Result")
    cy.contains("dt", "Court type").siblings().contains("MCA (MC adult)")
    cy.contains("dt", "LJA code").siblings().contains("2576")
    cy.contains("dt", "Court name").siblings().contains("London Croydon")
    cy.contains("dt", "Hearing language").siblings().contains("Don't know (D)")
    cy.contains("dt", "Documentation language").siblings().contains("Don't know (D)")
  })

  it("Should display the content of the Offences tab", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])
    loginAndVisit("/bichard/court-cases/0")
    clickTab("Offences")

    cy.contains("tbody tr:nth-child(1) td:nth-child(2)", "1")
    cy.contains("tbody tr:nth-child(1) td:nth-child(3)", "28/11/2010")
    cy.contains("tbody tr:nth-child(1) td:nth-child(4)", "SX03001A")
    cy.contains(
      "tbody tr:nth-child(1) td:nth-child(5) a",
      "Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003"
    )

    cy.contains("tbody tr:nth-child(2) td:nth-child(2)", "3")
    cy.contains("tbody tr:nth-child(2) td:nth-child(3)", "28/11/2010")
    cy.contains("tbody tr:nth-child(2) td:nth-child(4)", "SX03001")
    cy.contains("tbody tr:nth-child(2) td:nth-child(5) a", "Rape a girl aged 13 / 14 / 15 - SOA 2003")

    cy.contains("tbody tr:nth-child(3) td:nth-child(2)", "5")
    cy.contains("tbody tr:nth-child(3) td:nth-child(3)", "28/11/2010")
    cy.contains("tbody tr:nth-child(3) td:nth-child(4)", "RT88191")
    cy.contains(
      "tbody tr:nth-child(3) td:nth-child(5) a",
      "Use a motor vehicle on a road / public place without third party insurance"
    )

    // Checking the first offence details
    cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

    cy.contains("h2", "Offence 1 of 3")
    cy.contains("dt", "Offence code").siblings().should("contain.text", "SX03001A")
    cy.contains("dt", "Offence title")
      .siblings()
      .contains("Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "On or in")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "28/11/2010")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "Date code: 1")
    cy.contains("dt", "Arrest date").siblings().contains("01/12/2010")
    cy.contains("dt", "Charge date").siblings().contains("02/12/2010")
    cy.contains("dt", "Conviction date").siblings().contains("26/09/2011")
    cy.contains("dt", "Offence description")
      .siblings()
      .contains("Attempt to rape a girl aged 13 / 14 / 15 / years of age - SOA 2003.")
    cy.contains("dt", "Offence location").siblings().contains("Kingston High Street")
    cy.contains("dt", "PNC sequence number").siblings().contains("001")
    cy.contains("dt", "Court offence sequence number").siblings().contains("1")
    cy.contains("dt", "Plea").siblings().contains("NG (Not guilty)")
    cy.contains("dt", "Verdict").siblings().contains("G (Guilty)")
    cy.contains("dt", "Offence category").siblings().contains("CI (indictable)")
    cy.contains("dt", "Recordable on PNC").siblings().contains("Yes")
    cy.contains("dt", "Committed on bail").siblings().contains("D (Don't know)")
    cy.contains("dt", "Notifiable to Home Office").siblings().contains("Y")
    cy.contains("dt", "Home Office classification").siblings().contains("019/11")

    cy.contains("dt", "CJS Code").siblings().contains("3078")
    cy.contains("dt", "Result hearing type").siblings().contains("Other")
    cy.contains("dt", "Result hearing date").siblings().contains("26/09/2011")

    cy.contains("dt", "Type of trial").siblings().contains("SUM")
    cy.contains("dt", "Hearing result description").siblings().contains("Travel Restriction Order")
    cy.contains("dt", "PNC disposal type").siblings().contains("3078")
    cy.contains("dt", "Type of result").siblings().contains("Judgement with final result")
    cy.contains("dt", "PNC adjudication exists").siblings().contains("N")
    cy.contains(".qualifier h2", "Qualifier")
    cy.contains(".qualifier dt", "Code").siblings().contains("A")

    // Checking the second offence details
    cy.contains("a", "Back to all offences").click()
    cy.get("tbody tr:nth-child(2) td:nth-child(5) a").click()

    cy.contains("h2", "Offence 2 of 3")
    cy.contains("dt", "Offence code").siblings().contains("SX03001")
    cy.contains("dt", "Offence title").siblings().contains("Rape a girl aged 13 / 14 / 15 - SOA 2003")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "On or in")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "28/11/2010")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "Date code: 1")
    cy.contains("dt", "Arrest date").siblings().contains("01/12/2010")
    cy.contains("dt", "Charge date").siblings().contains("02/12/2010")
    cy.contains("dt", "Conviction date").siblings().contains("26/09/2011")
    cy.contains("dt", "Offence description").siblings().contains("Rape of a Female")
    cy.contains("dt", "Offence location").siblings().contains("Kingston High Street")
    cy.contains("dt", "PNC sequence number").siblings().contains("002")
    cy.contains("dt", "Court offence sequence number").siblings().contains("3")
    cy.contains("dt", "Plea").siblings().contains("NG (Not guilty)")
    cy.contains("dt", "Verdict").siblings().contains("G (Guilty)")
    cy.contains("dt", "Offence category").siblings().contains("CI (indictable)")
    cy.contains("dt", "Recordable on PNC").siblings().contains("Yes")
    cy.contains("dt", "Committed on bail").siblings().contains("D (Don't know)")
    cy.contains("dt", "Notifiable to Home Office").siblings().contains("Y")
    cy.contains("dt", "Home Office classification").siblings().contains("019/07")

    cy.contains("dt", "CJS Code").siblings().contains("3052")
    cy.contains("dt", "Result hearing type").siblings().contains("Other")
    cy.contains("dt", "Result hearing date").siblings().contains("26/09/2011")
    cy.contains("dt", "Type of trial").siblings().contains("SUM")
    cy.contains("dt", "Hearing result description").siblings().contains("defendant must never be allowed out")
    cy.contains("dt", "PNC disposal type").siblings().contains("3052")
    cy.contains("dt", "Type of result").siblings().contains("Judgement with final result")
    cy.contains("dt", "PNC adjudication exists").siblings().contains("N")
    cy.contains("dt", "Urgent").siblings().contains("Yes")
    cy.contains("dt", "Urgency").siblings().contains("24 Hours")

    // Checking the third offence details
    cy.contains("a", "Back to all offences").click()
    cy.get("tbody tr:nth-child(3) td:nth-child(5) a").click()

    cy.contains("h2", "Offence 3 of 3")
    cy.contains("dt", "Offence code").siblings().contains("RT88191")
    cy.contains("dt", "Offence title")
      .siblings()
      .contains("Use a motor vehicle on a road / public place without third party insurance")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "On or in")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "28/11/2010")
    cy.contains("dt", "Offence start date").siblings().should("contain.text", "Date code: 1")
    cy.contains("dt", "Arrest date").siblings().contains("01/12/2010")
    cy.contains("dt", "Charge date").siblings().contains("02/12/2010")
    cy.contains("dt", "Conviction date").siblings().contains("26/09/2011")
    cy.contains("dt", "Offence description").siblings().contains("Use a motor vehicle without third party insurance.")
    cy.contains("dt", "Offence location").siblings().contains("Kingston High Street")
    cy.contains("dt", "PNC sequence number").siblings().contains("003")
    cy.contains("dt", "Court offence sequence number").siblings().contains("5")
    cy.contains("dt", "Plea").siblings().contains("NG (Not guilty)")
    cy.contains("dt", "Verdict").siblings().contains("G (Guilty)")
    cy.contains("dt", "Offence category").siblings().contains("CM (summary motoring)")
    cy.contains("dt", "Recordable on PNC").siblings().contains("No")
    cy.contains("dt", "Committed on bail").siblings().contains("D (Don't know)")
    cy.contains("dt", "Notifiable to Home Office").siblings().contains("N")
    cy.contains("dt", "Home Office classification").siblings().contains("809/01")

    cy.contains("dt", "CJS Code").siblings().contains("1015")
    cy.contains("dt", "Result hearing type").siblings().contains("Other")
    cy.contains("dt", "Result hearing date").siblings().contains("26/09/2011")
    cy.contains("dt", "Type of trial").siblings().contains("SUM")
    cy.contains("dt", "Hearing result description").siblings().contains("Fined 100.")
    cy.contains("dt", "PNC disposal type").siblings().contains("1015")
    cy.contains("dt", "Type of result").siblings().contains("Judgement with final result")
    cy.contains("dt", "PNC adjudication exists").siblings().contains("N")
  })

  it("Should be able to see 'Hearing result' heading before every hearing result, when there are multiple", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: dummyMultipleHearingResultsAho.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")
    clickTab("Offences")
    cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

    cy.get('h2.govuk-summary-card__title:contains("Hearing result")').should("have.length", 6)
  })

  it("Should be able to see 'Hearing result' heading before every hearing result, when there is one", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: DummyHO100200Aho.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")
    clickTab("Offences")
    cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

    cy.get('h2.govuk-summary-card__title:contains("Hearing result")').should("have.length", 1)
  })

  it("Should show triggers tab by default when navigating to court case details page", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerItemIdentity: 1,
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerId: 1,
        triggerItemIdentity: 1,
        triggerCode: TriggerCode.TRPR0015,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T11:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".moj-tab-panel-triggers").should("be.visible")
    cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

    cy.get(".moj-tab-panel-triggers .moj-trigger-row").eq(0).contains("PR10 / Offence 1")
    cy.get(".moj-tab-panel-triggers .moj-trigger-row")
      .eq(0)
      .contains("Bail conditions imposed/varied/cancelled - update remand screen")
    cy.get(".moj-tab-panel-triggers .moj-trigger-row input[type=checkbox]").eq(0).should("not.be.checked")

    cy.get(".moj-tab-panel-triggers .moj-trigger-row").eq(1).contains("PR15 / Offence 1")
    cy.get(".moj-tab-panel-triggers .moj-trigger-row").eq(1).contains("Personal details changed")
    cy.get(".moj-tab-panel-triggers .moj-trigger-row input[type=checkbox]").eq(1).should("not.be.checked")
  })

  it("Should display a message when case has no triggers", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".moj-tab-panel-triggers").should("not.be.visible")
    cy.get(".moj-tab-panel-exceptions").should("be.visible")
    cy.get(".case-details-sidebar a").contains("Triggers").click()

    cy.get(".moj-tab-panel-triggers .moj-trigger-row").should("not.exist")
    cy.get(".moj-tab-panel-triggers").contains("There are no triggers for this case.")
  })

  it("Should show exceptions in exceptions tab", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerItemIdentity: 1,
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".moj-tab-panel-triggers").should("be.visible")
    cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

    cy.get(".case-details-sidebar a").contains("Exceptions").click()

    cy.get(".moj-tab-panel-triggers").should("not.be.visible")
    cy.get(".moj-tab-panel-exceptions").should("be.visible")

    cy.get(".moj-tab-panel-exceptions .moj-exception-row").eq(0).contains("Next hearing date / Offence 1")
    cy.get(".moj-tab-panel-exceptions .moj-exception-row").eq(0).contains("HO100102 - Bad Date")
  })

  it("display a message when there are no exceptions for the case", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", hearingOutcome: DummyMultipleOffencesNoErrorAho.hearingOutcomeXml }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".case-details-sidebar a").contains("Exceptions").click()

    cy.get(".moj-tab-panel-triggers").should("not.be.visible")
    cy.get(".moj-tab-panel-exceptions").should("be.visible")

    cy.get(".moj-tab-panel-exceptions .moj-exception-row").should("not.exist")
    cy.get(".moj-tab-panel-exceptions").contains("There are no exceptions for this case.")
  })

  it("Should take the user to the offence tab when trigger is clicked", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0010,
        triggerItemIdentity: 1,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerId: 1,
        triggerCode: TriggerCode.TRPR0015,
        triggerItemIdentity: 2,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })

    loginAndVisit("/bichard/court-cases/0")

    cy.get(`.offence-details [data-testid="offence-details-1"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-2"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-3"]`).should("not.exist")

    cy.get(".moj-tab-panel-triggers .trigger-header button").eq(0).contains("Offence 1").click()
    cy.get(`[data-testid="offence-details-1"]`).should("have.text", "Offence 1 of 3")
    cy.get(".moj-tab-panel-triggers .trigger-header button").eq(1).contains("Offence 2").click()
    cy.get(`[data-testid="offence-details-2"]`).should("have.text", "Offence 2 of 3")
  })

  it("Should take the user to offence tab when exception is clicked", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(`.offence-details [data-testid="offence-details-1"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-2"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-3"]`).should("not.exist")

    cy.get(".case-details-sidebar a").contains("Exceptions").click()
    cy.get(".moj-tab-panel-exceptions .moj-exception-row").eq(0).contains("Next hearing date / Offence 1")
    cy.get(".exception-header .exception-location").click()
    cy.get(`[data-testid="offence-details-1"]`).should("have.text", "Offence 1 of 3")
  })

  it("Should be able to refresh after I click 'Back to all offences'", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

    loginAndVisit("/bichard/court-cases/0")

    cy.get(`.offence-details [data-testid="offence-details-1"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-2"]`).should("not.exist")
    cy.get(`.offence-details [data-testid="offence-details-3"]`).should("not.exist")

    cy.get(".case-details-sidebar a").contains("Exceptions").click()
    cy.get(".moj-tab-panel-exceptions .moj-exception-row").eq(0).contains("Next hearing date / Offence 1")
    cy.get(".exception-header .exception-location").click()
    cy.get(`[data-testid="offence-details-1"]`).should("have.text", "Offence 1 of 3")

    cy.contains("Back to all offences").click()
    cy.reload()
  })

  it("Should take the user to the case tab when exception is clicked", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", hearingOutcome: DummyHO100200Aho.hearingOutcomeXml }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get('[data-testid="case"]').should("not.be.visible")
    cy.get("h2").should("not.have.text", "Case")
    cy.get(".case-details-sidebar a").contains("Exceptions").click()
    cy.get(".moj-tab-panel-exceptions .moj-exception-row").eq(0).contains("Organisation unit code / Case Details")
    cy.get(".exception-header .exception-location").click()
    cy.get('[data-testid="case"]').should("be.visible")
  })

  it("Should show contextual help for a trigger when the accordion button is clicked", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date()
    }
    cy.task("insertTriggers", { caseId: 0, triggers: [trigger] })

    loginAndVisit("/bichard/court-cases/0")

    cy.get(".triggers-help-preview").should("have.text", "More information")
    cy.get(".triggers-help-preview").click()

    cy.get(".triggers-help-preview").should("have.text", "Hide")
    cy.get(".triggers-help h3").should("contain.text", "PNC screen to update")
    cy.get(".triggers-help p").should("have.text", "Driver Disqualification")
    cy.get(".triggers-help h3").should("contain.text", "CJS result code")
    cy.get(".triggers-help li").should("contain.text", "3028 Disqualification limited to")
    cy.get(".triggers-help li").should("contain.text", "3030 Driving license restored with effect from")
    cy.get(".triggers-help li").should(
      "contain.text",
      "3050 Reduced Disqualification from Driving after Completing Course"
    )
    cy.get(".triggers-help li").should(
      "contain.text",
      "3051 Reduced Disqualification from Driving - special reasons or mitigating circumstances"
    )
    cy.get(".triggers-help li").should("contain.text", "3070 Disqualified from Driving - Obligatory")
    cy.get(".triggers-help li").should("contain.text", "3071 Disqualified from Driving - Discretionary")
    cy.get(".triggers-help li").should("contain.text", "3072 Disqualified from Driving - Points (Totting)")
    cy.get(".triggers-help li").should("contain.text", "3073 Disqualified from Driving until Ordinary Test Passed")
    cy.get(".triggers-help li").should("contain.text", "3074 Disqualified from Driving until Extended Test Passed")
    cy.get(".triggers-help li").should("contain.text", "3094 Disqualified from Driving non motoring offence")
    cy.get(".triggers-help li").should("contain.text", "3095 Disqualified from Driving - vehicle used in Crime")
    cy.get(".triggers-help li").should("contain.text", "3096 Interim Disqualification from Driving")
  })

  it("Should generate a more information link for each exception (Non-PNC excception)", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", hearingOutcome: DummyHO100200Aho.hearingOutcomeXml }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("h3").should("not.have.text", "Case")
    cy.get(".case-details-sidebar a").contains("Exceptions").click()
    cy.get(".exception-help a")
      .contains("More information")
      .should("exist")
      .should("have.attr", "href", "/help/bichard-functionality/exceptions/resolution.html#HO100200")
  })

  it("Should generate a more information link for each exception (PNC excception)", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", hearingOutcome: DummyHO100302Aho.hearingOutcomeXml }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("h3").should("not.have.text", "Case")
    cy.get(".case-details-sidebar a").contains("Exceptions").click()
    cy.get(".exception-row__help a")
      .contains("More information")
      .should("exist")
      .should("have.attr", "href", "/help/bichard-functionality/exceptions/resolution.html#HO100302")
  })

  it("Should show a complete badge for triggers which have been resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "01", hearingOutcome: DummyHO100302Aho.hearingOutcomeXml }
    ])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Resolved",
      createdAt: new Date(),
      resolvedAt: new Date(),
      resolvedBy: "BichardForce01"
    }
    cy.task("insertTriggers", { caseId: 0, triggers: [trigger] })

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#triggers span").contains("Complete").should("exist")
  })

  canReallocateTestData.forEach(
    ({ canReallocate, triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
      it(`should show Reallocate button when triggers are ${triggers} and ${
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

        cy.get("a.b7-reallocate-button").should(canReallocate ? "exist" : "not.exist")
      })
    }
  )
})

export {}
