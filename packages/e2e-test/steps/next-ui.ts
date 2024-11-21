import { Given, Then, When } from "@cucumber/cucumber"
import * as legacy from "../utils/actions.legacy-ui"
import * as ui from "../utils/actions.next-ui"
import { checkAuditLogExists } from "../utils/auditLogging"
import { logInAs } from "../utils/auth"
import * as messages from "../utils/message"
import * as pnc from "../utils/pnc"
import * as reports from "../utils/reports"
import type Bichard from "../utils/world"

export const setupNextSteps = () => {
  Given("I am logged in as {string}", logInAs)

  // Misc
  When(
    "I wait {int} seconds",
    (delay) =>
      new Promise((resolve) => {
        setTimeout(resolve, delay * 1000)
      })
  )
  // TODO: remove this and refactor reliant tests when
  // old test suite is removed
  When(
    "I wait {string} seconds",
    (delay) =>
      new Promise((resolve) => {
        setTimeout(resolve, delay * 1000)
      })
  )
  Then("pending", () => "pending")

  // Audit Logging
  Then("the audit log contains {string}", async function (this: Bichard, eventType: string) {
    await checkAuditLogExists(this, eventType, true)
  })
  Then("{string} is not in the audit log", async function (this: Bichard, eventType: string) {
    await checkAuditLogExists(this, eventType, false)
  })

  // Messages
  When("{string} is received", messages.sendMessageForTest)

  // PNC Actions
  Given("the data for this test is in the PNC", pnc.mockPNCDataForTest)
  Given("the data for this test is not in the PNC", pnc.mockMissingPncDataForTest)
  Given("there is a valid record for {string} in the PNC", pnc.createValidRecordInPNC)
  Then("the PNC updates the record", pnc.checkMocks)
  Then("the PNC record has not been updated", pnc.pncNotUpdated)
  Then("the PNC update includes {string}", pnc.pncUpdateIncludes)
  Then("no PNC requests have been made", pnc.noPncRequests)
  Then("no PNC updates have been made", pnc.noPncUpdates)

  // Report Actions
  When("I fake the data for the operational trigger report", reports.fakeTriggerReportData)
  When("I fake the data for the Live Status Detail - Exceptions report", reports.fakeLiveStatusExceptionsReportData)
  Then("the user performance summary report is correct", reports.checkUserSummaryReport)
  Then("the Live Status Detail - Exceptions report is correct", reports.checkLiveStatusExceptionsReport)
  Then("the Resolved Exceptions report is correct", reports.checkResolvedExceptionsReport)
  When("I access the {string} report", reports.accessReport)
  When("I generate today's report", reports.generateTodaysReport)
  Then("I see {string} in the Warrants report", reports.reportContains)
  Then("I see {string} in the report", reports.reportContains)
  Then("I do not see {string} in the report", reports.reportDoesNotContain)

  // Old UI Actions
  When("I click the alternate {string} tab", legacy.loadTab)
  Then("the alternate exception list should contain a record for {string}", legacy.findRecordFor)
  Then("I see {string} in the {string} row of the alternate results table", legacy.checkOffenceData)

  // New UI Actions
  When("I view the list of exceptions", ui.goToExceptionList)
  When("I open this record", ui.openRecordForCurrentTest)
  When("I open the record for {string}", ui.openRecordFor)
  When("I click the {string} tab", ui.loadTab)
  When("I return to the offence list", ui.returnToOffenceList)
  When("I click the {string} button", ui.clickButton)
  When("I resolve all of the triggers", ui.resolveAllTriggers)
  When("I select trigger {string} to resolve", ui.selectTriggerToResolve)
  When("I resolve the selected triggers", ui.resolveSelectedTriggers)
  When("I correct {string} to {string}", ui.correctOffenceException)
  When("I wait for {string} in the list of records", ui.waitForRecordStep)
  When("I see {int} record for {string}", ui.nRecordsForPerson)
  When("I see {string} record for {string}", async function (this: Bichard, count: string, name: string) {
    const n = Number.parseInt(count, 10)
    await ui.nRecordsForPerson.apply(this, [n, name])
  })
  Then("the exception list should contain a record for {string}", ui.findRecordFor)
  Then("the record for {string} should not have any PNC errors", ui.checkNoPncErrors)
  Then("I see exception {string} in the exception list table", ui.canSeeContentInTable)
  Then("I see exception {string} for this record in the exception list", ui.canSeeContentInTableForThis)
  Then("there are no exceptions raised for {string}", ui.noExceptionPresentForOffender)
  Then("there are no triggers raised for {string}", ui.noTriggersPresentForOffender)
  Then("I see trigger {string} in the exception list table", ui.canSeeContentInTable)
  Then("I see trigger {string} for this record in the exception list", ui.canSeeContentInTableForThis)
  Then("I cannot see trigger {string} in the exception list table", ui.cannotSeeTrigger)
  Then("I cannot see exception {string} in the exception list table", ui.cannotSeeTrigger)
  Then("I see trigger {string} for offence {string}", ui.checkTriggerforOffence)
  Then("I see complete trigger {string} for offence {string}", ui.checkCompleteTriggerforOffence)
  Then("I see trigger {string}", ui.checkTrigger)
  Then("this {string} is {string}", ui.checkRecordForThisTestResolved)
  Then("this {string} is not {string}", ui.checkRecordForThisTestNotResolved)
  Then("I manually resolve the record", ui.manuallyResolveRecord)
  Then("I see {string} in the {string} row of the results table", ui.checkOffenceData)
  Then("I see error {string} in the {string} row of the results table", ui.checkOffenceDataError)
  Then("there are no exceptions", ui.checkNoExceptions)
  Then("there are no exceptions for this record", ui.checkNoExceptionsForThis)
  Then("there are no exceptions or triggers", ui.checkNoRecords)
  Then("there are no exceptions or triggers for this record", ui.checkNoRecordsForThis)
  Then("I see {string} for offence {string}", ui.checkOffence)
  When("I reallocate the case to {string}", ui.reallocateCaseToForce)
  Then("there should only be {string} records", ui.nRecordsInList)
  Then("I unlock the record and return to the list", ui.returnToCaseListUnlock)
  Then("the record for {string} does not exist", ui.noRecordsForPerson)
  Then("I see {string} in the table", ui.checkNoteExists)
  When("I switch to the alternate version of bichard", ui.switchBichard)
  When("I view offence {string}", ui.viewOffence)
  When("I view offence with text {string}", ui.viewOffenceByText)
  When("I match the offence to PNC offence {string}", ui.matchOffence)
  When("I match the offence to PNC offence {string} in case {string}", ui.matchOffenceAndCcr)
  When("I match the offence as Added In Court", ui.offenceAddedInCourt)
  When("I submit the record", ui.submitRecord)
  When("I submit the record on the case details page", ui.submitRecordAndStayOnPage)
  Then("I reload until I see {string}", ui.reloadUntilStringPresent)
  Then("I reload until I don't see {string}", ui.reloadUntilStringNotPresent)
  Then("I return to the list", ui.returnToCaseListUnlock)
  Then("the {string} for {string} is {string}", ui.checkRecordStatus)
  Then("the {string} for {string} is not {string}", ui.checkRecordNotStatus)
  Then("the invalid {string} can be submitted", ui.invalidFieldCanBeSubmitted)
  Then("I see the correction for {string} to {string}", ui.checkCorrectionFieldAndValue)
  Then("I correct {string} and type {string}", ui.correctOffenceExceptionByTypeahead)
  Then("I select the first option", ui.selectTheFirstOption)
  Then("I correct {string} and press {string}", ui.inputFieldToKeyboardPress)
  Then("I see the Correction badge", ui.seeCorrectionBadge)
  When("I go to the Case Details for this exception {string}", ui.goToExceptionPage)
  Then("I reload the page", ui.reload)
  Then("I remove the year from {string}", ui.removeYear)
  Then("I should see an error {string}", ui.seeError)
  Then("I apply filter {string} to be {string}", ui.filter)
  Then("I add a checkmark to {string}", ui.addCheckMark)
  Then("I reset the filters", ui.clearFilters)
  Then("I see record for {string}", ui.canSeeContentInTable)
  Then("I do not see record for {string}", ui.cannotSeeContentInTable)
  Then("I see exceptions resolution status as {string}", ui.exceptionResolutionStatus)
  Then("I see exceptions resolution status as {string} on case details page", ui.exceptionResolutionStatusOnCaseDetails)
}
