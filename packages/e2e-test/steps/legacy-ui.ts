import { Given, Then, When } from "@cucumber/cucumber"
import * as legacy from "../utils/actions.legacy-ui"
import { logInAs } from "../utils/auth"
import { sendMessageForTest } from "../utils/message"
import {
  checkMocks,
  createValidRecordInPNC,
  mockMissingPncDataForTest,
  mockPNCDataForTest,
  noPncRequests,
  noPncUpdates,
  pncNotUpdated,
  pncUpdateIncludes
} from "../utils/pnc"
import {
  accessReport,
  checkLiveStatusExceptionsReport,
  checkResolvedExceptionsReport,
  checkUserSummaryReport,
  fakeLiveStatusExceptionsReportData,
  fakeTriggerReportData,
  generateTodaysReport,
  reportContains,
  reportDoesNotContain
} from "../utils/reports"

import * as ui from "../utils/actions.next-ui"

import { checkAuditLogExists } from "../utils/auditLogging"
import type Bichard from "../utils/world"

export const setupLegacySteps = () => {
  Given("the data for this test is in the PNC", mockPNCDataForTest)
  Given("the data for this test is not in the PNC", mockMissingPncDataForTest)
  Given("there is a valid record for {string} in the PNC", createValidRecordInPNC)
  Given("I am logged in as {string}", logInAs)
  Given("I navigate to the list of reports", legacy.canSeeReports)

  When("{string} is received", sendMessageForTest)
  When("I view the list of exceptions", legacy.goToExceptionList)
  When("I visit the Team Management screen", legacy.visitTeamPage)
  When("I open this record", legacy.openRecordForCurrentTest)
  When("I open the record for {string}", legacy.openRecordFor)
  When("I click the {string} menu button", legacy.clickMainTab)
  When("I click the {string} button", legacy.clickButton)
  When("I return to the list", legacy.returnToList)
  When("I submit the record", legacy.submitRecord)
  When("I submit the unchanged record", legacy.submitUnchangedRecord)
  When("I access the {string} report", accessReport)
  When("I download the report", legacy.downloadCSV)
  When("I click the {string} tab", legacy.loadTab)
  When("I return to the offence list", async function () {
    await legacy.loadTab.apply(this as Bichard, ["Offences"])
  })
  When("I resolve all of the triggers", legacy.resolveAllTriggers)
  When("I resolve the selected triggers", legacy.resolveSelectedTriggers)
  When("I wait {string} seconds", async (delay) => {
    await new Promise((resolve) => {
      setTimeout(resolve, delay * 1000)
    })
  })
  When("I view offence {string}", legacy.viewOffence)
  When("I unlock the record and return to the list", legacy.returnToCaseListUnlock)
  When("I correct {string} to {string}", legacy.correctOffenceException)
  When("I match the offence to PNC offence {string}", legacy.matchOffence)
  When("I match the offence to PNC offence {string} in case {string}", legacy.matchOffenceAndCcr)
  When("I match the offence as Added In Court", () => {})
  When("I prepend {string} with {string}", legacy.correctOffenceFreeTextException)
  When("I wait for {string} in the list of records", legacy.waitForRecordStep)
  When("I generate today's report", generateTodaysReport)
  When("I reallocate the case to {string}", legacy.reallocateCaseToForce)
  When("I select trigger {string} to resolve", legacy.selectTrigger)
  When("I fake the data for the operational trigger report", fakeTriggerReportData)
  When("I fake the data for the Live Status Detail - Exceptions report", fakeLiveStatusExceptionsReportData)
  When("I switch to the alternate version of bichard", legacy.switchBichard)
  When("I click the alternate {string} tab", ui.loadTab)
  When("I search by state {string}", legacy.searchByState)

  Then("I reload until I see {string}", legacy.reloadUntilStringPresent)
  Then("I reload until I see {string} for this record", legacy.reloadUntilStringPresentForRecord)
  Then("I reload until I don't see {string}", legacy.reloadUntilStringNotPresent)
  Then("the exception list should contain a record for {string}", legacy.findRecordFor)
  Then("the record for {string} should not have any PNC errors", legacy.checkNoPncErrors)
  Then("the PNC updates the record", checkMocks)
  Then("I can see exceptions", legacy.exceptionsAreVisible)
  Then("I can see triggers", legacy.triggersAreVisible)
  Then("I cannot make any changes", legacy.exceptionIsReadOnly)
  Then("I see exception {string} in the exception list table", legacy.canSeeContentInTable)
  Then("I see exception {string} for this record in the exception list", legacy.canSeeContentInTableForThis)
  Then("I cannot see {string} in the exception list table", legacy.cannotSeeException)
  Then("there are no exceptions raised for {string}", legacy.noExceptionPresentForOffender)
  Then("I see {string} record for {string}", legacy.recordsForPerson)
  Then("there are no triggers raised for {string}", legacy.noTriggersPresentForOffender)
  Then("I can correct the exception", legacy.exceptionIsEditable)
  Then("I cannot correct the exception", legacy.exceptionIsNotEditable)
  Then("the {string} menu item is not visible", legacy.buttonIsNotVisible)
  Then("I can reallocate the case to another force area", legacy.reallocateCase)
  Then("I cannot reallocate the case to another force area", legacy.cannotReallocateCase)
  Then("I see trigger {string} in the exception list table", legacy.canSeeContentInTable)
  Then("I see trigger {string} for this record in the exception list", legacy.canSeeContentInTableForThis)
  Then("I cannot see trigger {string} in the exception list table", legacy.cannotSeeTrigger)
  Then("I cannot see exception {string} in the exception list table", legacy.cannotSeeTrigger)
  Then("the {string} menu item is visible", legacy.buttonIsVisible)
  Then("I can see the QA status of a record", legacy.canSeeQAStatus)
  Then("I am taken to a list of reports", legacy.canSeeReports)
  Then("I can add and remove members from my team", legacy.editTeam)
  Then("the {string} report will be downloaded as a CSV file", legacy.checkFileDownloaded)
  Then("the PNC record has not been updated", pncNotUpdated)
  Then("I see trigger {string} for offence {string}", legacy.checkTriggerforOffence)
  Then("I see complete trigger {string} for offence {string}", legacy.checkCompleteTriggerforOffence)
  Then("I see trigger {string}", legacy.checkTrigger)
  Then("the {string} for {string} is {string}", legacy.checkRecordResolved)
  Then("this {string} is {string}", legacy.checkRecordForThisTestResolved)
  Then("the {string} for {string} is not {string}", legacy.checkRecordNotResolved)
  Then("this {string} is not {string}", legacy.checkRecordForThisTestNotResolved)
  Then("I manually resolve the record", legacy.manuallyResolveRecord)
  Then("I see {string} in the {string} row of the results table", legacy.checkOffenceData)
  Then("I see {string} in the table", legacy.checkNoteExists)
  Then("I see error {string} in the {string} row of the results table", legacy.checkOffenceDataError)
  Then("the record for {string} does not exist", legacy.checkRecordNotExists)
  Then("there are no exceptions", legacy.checkNoExceptions)
  Then("there are no exceptions for this record", legacy.checkNoExceptionsForThis)
  Then("there are no exceptions or triggers", legacy.checkNoRecords)
  Then("there are no exceptions or triggers for this record", legacy.checkNoRecordsForThis)
  Then("I see {string} in the Warrants report", reportContains)
  Then("I see {string} in the report", reportContains)
  Then("I do not see {string} in the report", reportDoesNotContain)
  Then("pending", () => "pending")
  Then("the PNC update includes {string}", pncUpdateIncludes)
  Then("I see {string} for offence {string}", legacy.checkOffence)
  Then("there should only be {string} offences", legacy.checkTableRows)
  Then("there should only be {string} records", legacy.checkRecordRows)
  Then("the audit log contains {string}", async function (eventType) {
    await checkAuditLogExists(this as Bichard, eventType, true)
  })
  Then("{string} is not in the audit log", async function (eventType) {
    await checkAuditLogExists(this as Bichard, eventType, false)
  })
  Then("the user performance summary report is correct", checkUserSummaryReport)
  Then("the Live Status Detail - Exceptions report is correct", checkLiveStatusExceptionsReport)
  Then("the Resolved Exceptions report is correct", checkResolvedExceptionsReport)
  Then("no PNC requests have been made", noPncRequests)
  Then("no PNC updates have been made", noPncUpdates)
  Then("I should not see a button to switch to the alternate version of bichard", legacy.cannotSeeBichardSwitcher)
  Then("I see {string} in the {string} row of the alternate results table", ui.checkOffenceData)
  Then("the alternate exception list should contain a record for {string}", ui.findRecordFor)
  Then("I save a record", legacy.saveChanges)
  Then("I see the correction for {string} to {string}", legacy.checkCorrectionFieldAndValue)
}
