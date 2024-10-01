import { expect } from "expect"
import type { Page } from "puppeteer"
import { checkForFile } from "../helpers/fsHelper"
import {
  reloadUntilContent,
  reloadUntilContentInSelector,
  reloadUntilNotContent,
  reloadUntilSelector,
  waitForRecord
} from "./puppeteer-utils"
import { caseListPage } from "./urls"
import type Bichard from "./world"

const filterByRecordName = async function (world: Bichard) {
  const name = world.getRecordName()
  const searchField = "input[name='defendantSearch']"

  // Triple click selects any existing text so we type over it
  await world.browser.page.click(searchField, { clickCount: 3 })
  await world.browser.page.type(searchField, name)
  await Promise.all([world.browser.page.keyboard.press("Enter"), world.browser.page.waitForNavigation()])
}

export const containsValue = async function (page: Page, selector: string, value: string) {
  await page.waitForSelector(selector)

  const matches = await page.$$(selector).then((els) => els.map((el) => el.getProperty("innerText")))
  const innerTexts = await Promise.all(matches)
  const jsonValues = await Promise.all(await innerTexts.map((m) => m.jsonValue()))

  return jsonValues.some((j) => (j as string[]).includes(value))
}

export const getTableData = async function (world: Bichard, selector: string) {
  const trPromises = await world.browser.page
    .$$(selector)
    .then((els) =>
      els.map((elHandle) =>
        elHandle.evaluate((el) => Array.from(el.querySelectorAll("td")).map((e) => e.innerText.trim()))
      )
    )
  return Promise.all(trPromises)
}

export const getRawTableData = async function (world: Bichard, selector: string) {
  const trPromises = await world.browser.page
    .$$(selector)
    .then((els) =>
      els.map((elHandle) => elHandle.evaluate((el) => Array.from(el.querySelectorAll("td")).map((e) => e.innerHTML)))
    )
  return Promise.all(trPromises)
}

type DataTableValue = {
  column: number
  value: string
  exact: boolean
}

const checkDataTable = async function (world: Bichard, values: DataTableValue[]) {
  const tableData = await getTableData(world, "#br7_exception_details_court_data_table .resultsTable tbody tr")

  const check = tableData.filter((row) =>
    values.every((val) => {
      if (val.exact) {
        return row[val.column - 1] && row[val.column - 1] === val.value
      }

      return row[val.column - 1] && row[val.column - 1].includes(val.value)
    })
  )
  expect(check.length).toEqual(1)
}

export const goToExceptionList = async function (this: Bichard) {
  if (this.config.noUi) {
    return
  }

  await Promise.all([this.browser.page.goto(caseListPage()), this.browser.page.waitForNavigation()])
}

export const findRecordFor = async function (this: Bichard, name: string) {
  await reloadUntilSelector(this.browser.page, ".resultsTable a.br7_exception_list_record_table_link")
  await this.browser.page.waitForFunction(
    `document.querySelector('.resultsTable a.br7_exception_list_record_table_link').innerText.includes('${name}')`
  )
}

export const checkNoPncErrors = async function (this: Bichard, name: string) {
  expect(await this.browser.elementText(".resultsTable a.br7_exception_list_record_table_link")).toBe(name)
  await this.browser.page.click(".resultsTable a.br7_exception_list_record_table_link")
  await containsValue(this.browser.page, "#br7_exception_details_pnc_data_table", "Theft of pedal cycle")
}

export const openRecordFor = async function (this: Bichard, name: string) {
  await waitForRecord(this.browser.page)
  const record = `.resultsTable a.br7_exception_list_record_table_link[title^='${name}']`

  await Promise.all([this.browser.page.click(record), this.browser.page.waitForNavigation()])
}

export const openRecordForCurrentTest = async function (this: Bichard) {
  const record = `.resultsTable a.br7_exception_list_record_table_link[title^='${this.getRecordName()}']`

  await filterByRecordName(this)
  await waitForRecord(this.browser.page)
  await Promise.all([this.browser.page.click(record), this.browser.page.waitForNavigation()])
}

const loadRecordTab = async function (page: Page, selectorToClick: string, selectorToWaitFor: string) {
  await page.waitForSelector(selectorToClick)
  await Promise.all([page.click(selectorToClick), page.waitForNavigation()])
  await page.waitForSelector(selectorToWaitFor)
}

export const loadDefendantTab = async function (page: Page) {
  await loadRecordTab(page, "#br7_button_Defendant", ".br7_exception_details_column_name")
}

export const loadTriggersTab = async function (page: Page) {
  await loadRecordTab(page, "#br7_button_Trigger", ".br7_exception_details_trigger_description_column")
}

export const loadTab = async function (this: Bichard, tabName: string) {
  const tabIds: Record<string, string> = {
    hearing: "#br7_button_Hearing",
    case: "#br7_button_Case",
    defendant: "#br7_button_Defendant",
    offences: "#br7_button_OffenceList",
    notes: "#br7_button_Note",
    triggers: "#br7_button_Trigger",
    "pnc errors": "#br7_button_PNCError"
  }
  const tabId = tabIds[tabName.toLowerCase()]
  if (!tabId) {
    throw new Error("Unsupported tab name")
  }

  await loadRecordTab(this.browser.page, tabId, ".br7_exception_details_court_data_tabs_table")
}

export const isExceptionEditable = async function (page: Page) {
  await loadDefendantTab(page)

  const editException = await page.$("input[type='text'][name='newValue(ASN)']")

  return Boolean(editException)
}

export const exceptionIsEditable = async function (this: Bichard) {
  const editable = await isExceptionEditable(this.browser.page)
  expect(editable).toBe(true)
}

export const exceptionIsNotEditable = async function (this: Bichard) {
  const editable = await isExceptionEditable(this.browser.page)
  expect(editable).toBe(false)
}

const isButtonVisible = async function (page: Page, sectionName: string) {
  const triggersBtn = await page.$(
    `.br7_exception_details_court_data_tabs_table input[type='submit'][value='${sectionName}']`
  )

  return Boolean(triggersBtn)
}

export const clickButton = async function (this: Bichard, value: string) {
  const { page } = this.browser
  await Promise.all([page.click(`input[type='submit'][value='${value}']`), page.waitForNavigation()])
}

export const clickMainTab = async function (this: Bichard, label: string) {
  await this.browser.page.waitForSelector("span.wpsNavLevel1")

  const links = await this.browser.page.$$eval("span.wpsNavLevel1", (sections) => sections.map((s) => s.textContent))
  expect(links).toContain(label)
}

export const checkFileDownloaded = async function (fileName: string) {
  const result = await checkForFile("tmp", fileName)
  expect(result).toBe(true)
}

export const downloadCSV = async function (this: Bichard) {
  await this.browser.setupDownloadFolder("./tmp")
  await this.browser.page.waitForSelector("table#portletTop input[value='Download CSV File']")
  await this.browser.page.click("table#portletTop input[value='Download CSV File']")
}

export const reallocateCase = async function (this: Bichard) {
  const { page } = this.browser
  await this.browser.clickAndWait("#br7_exception_details_view_edit_buttons > input[value='Reallocate Case']")

  // Bedfordshire Police has value 28...
  await page.select("#reallocateAction", "28")

  await this.browser.clickAndWait("input[value='OK']")
  await this.browser.clickAndWait(".resultsTable a.br7_exception_list_record_table_link")
  await loadRecordTab(this.browser.page, "#br7_button_Note", ".br7_exception_details_court_data_tabs_table")

  const latestNote = await page
    .$("#br7_exception_details_display_notes tr > td")
    .then((el) => el?.getProperty("innerText"))
    .then((el) => el?.jsonValue())

  expect(latestNote).toContain("Case reallocated to new force owner")
}

export const reallocateCaseToForce = async function (this: Bichard, force: string) {
  const { page } = this.browser
  await this.browser.clickAndWait("#br7_exception_details_view_edit_buttons > input[value='Reallocate Case']")
  const options = await page.$$eval("#reallocateAction option", (els) =>
    els.map((el) => ({ id: el.getAttribute("value"), text: el.innerText.trim() }))
  )
  const selectedOptionId = options.find((option) => option.text.includes(force))?.id
  await page.select("#reallocateAction", selectedOptionId ?? "")
  await this.browser.clickAndWait("input[value='OK']")
}

export const canSeeContentInTable = async function (this: Bichard, value: string) {
  const found = await reloadUntilContentInSelector(this.browser.page, value, ".resultsTable > tbody td")
  expect(found).toBeTruthy()
}

export const canSeeContentInTableForThis = async function (this: Bichard, value: string) {
  await filterByRecordName(this)
  const found = await reloadUntilContentInSelector(this.browser.page, value, ".resultsTable > tbody td")
  expect(found).toBeTruthy()
}

export const cannotSeeTrigger = async function (this: Bichard, value: string) {
  await waitForRecord(this.browser.page, 2)
  const isVisible = await containsValue(this.browser.page, ".resultsTable > tbody td", value)
  expect(isVisible).toBe(false)
}

export const cannotSeeException = async function (this: Bichard, exception: string) {
  await waitForRecord(this.browser.page, 2)
  const isVisible = await containsValue(this.browser.page, ".resultsTable > tbody td", exception)
  expect(isVisible).toBe(false)
}

export const noExceptionPresentForOffender = async function (this: Bichard, name: string) {
  await new Promise((resolve) => {
    setTimeout(resolve, 3 * 1000)
  })

  // Grab the current value of the exception type filter so that it can be restored after the test
  const filterValue = await this.browser.page.$eval("#exceptionTypeFilter > option[selected]", (el) => el.textContent)

  await this.browser.selectDropdownOption("exceptionTypeFilter", "Exceptions")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
  const isVisible = await containsValue(this.browser.page, ".resultsTable > tbody td", name)
  expect(isVisible).toBe(false)

  // Restore the previous exception type filter setting
  await this.browser.selectDropdownOption("exceptionTypeFilter", filterValue ?? "")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
}

export const recordsForPerson = async function (this: Bichard, count: string, name: string) {
  await new Promise((resolve) => {
    setTimeout(resolve, 3 * 1000)
  })

  // Grab the current value of the exception type filter so that it can be restored after the test
  const filterValue = await this.browser.page.$eval("#exceptionTypeFilter > option[selected]", (el) => el.textContent)

  await this.browser.selectDropdownOption("exceptionTypeFilter", "All")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
  const links = await this.browser.page.$$(`.resultsTable a.br7_exception_list_record_table_link[title^='${name}']`)
  expect(links.length).toEqual(Number(count))

  // Restore the previous exception type filter setting
  await this.browser.selectDropdownOption("exceptionTypeFilter", filterValue ?? "")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
}

export const noTriggersPresentForOffender = async function (this: Bichard, name: string) {
  await new Promise((resolve) => {
    setTimeout(resolve, 3 * 1000)
  })

  // Grab the current value of the exception type filter so that it can be restored after the test
  const filterValue = await this.browser.page.$eval("#exceptionTypeFilter > option[selected]", (el) => el.textContent)

  await this.browser.selectDropdownOption("exceptionTypeFilter", "Triggers")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
  const isVisible = await containsValue(this.browser.page, ".resultsTable > tbody td", name)
  expect(isVisible).toBe(false)

  // Restore the previous exception type filter setting
  await this.browser.selectDropdownOption("exceptionTypeFilter", filterValue ?? "")
  await this.browser.clickAndWait("table.br7_exception_list_filter_table input[type=submit][value=Refresh]")
}

export const buttonIsNotVisible = async function (this: Bichard, sectionName: string) {
  const visible = await isButtonVisible(this.browser.page, sectionName)
  expect(visible).toBe(false)
}

export const buttonIsVisible = async function (this: Bichard, sectionName: string) {
  const visible = await isButtonVisible(this.browser.page, sectionName)
  expect(visible).toBe(true)
}

export const triggersAreVisible = async function (this: Bichard) {
  await loadTriggersTab(this.browser.page)

  await expect(await this.browser.pageText()).toMatch(
    "TRPR0010 - Bail conditions imposed/varied/cancelled - update remand screen"
  )
}

export const exceptionsAreVisible = async function (this: Bichard) {
  await loadDefendantTab(this.browser.page)

  await expect(await this.browser.pageText()).toMatch("HO100300 - Organisation not recognised")
}

export const exceptionIsReadOnly = async function (this: Bichard) {
  const editable = await isExceptionEditable(this.browser.page)
  expect(editable).toBe(false)

  // auditors can only select "Return To List" so there should only be one "edit" button
  const editBtnsWrapper = await this.browser.page.waitForSelector("#br7_exception_details_view_edit_buttons")
  const editBtns = await editBtnsWrapper?.$$eval("input", (inputs) => inputs.length)
  expect(editBtns).toEqual(1)
}

export const canSeeReports = async function (this: Bichard) {
  const [, reportsBtn] = await this.browser.page.$$("span.wpsNavLevel1")

  await Promise.all([reportsBtn.click(), this.browser.page.waitForNavigation()])

  await this.browser.page.waitForSelector("#report-index-list .wpsNavLevel2")

  await expect(await this.browser.pageText()).toMatch("Live Status Summary")
}

export const canSeeQAStatus = async function (this: Bichard) {
  await this.browser.page.waitForSelector(".resultsTable")

  const exceptionTableHeaders = await this.browser.page.$$eval(".resultsTable th", (headers) =>
    headers.map((h) => h.textContent?.trim())
  )

  expect(exceptionTableHeaders).toContain("QA Status")
}

export const visitTeamPage = async function (this: Bichard) {
  await this.browser.page.waitForSelector("span.wpsNavLevel1")

  const links = await this.browser.page.$$eval("span.wpsNavLevel1", (sections) => sections.map((s) => s.textContent))
  expect(links).toContain("Team")

  const [, , teamBtn] = await this.browser.page.$$("span.wpsNavLevel1")
  await Promise.all([teamBtn.click(), this.browser.page.waitForSelector("#br7_team_management_own_team")])
  await expect(await this.browser.pageText()).toMatch("My Team Members")
}

export const editTeam = async function (this: Bichard) {
  const { page } = this.browser
  const removeUserCheckboxSelector = "input[type='checkbox'][name='usersToRemove']"

  // add user

  await page.type("input[name='userToAdd']", "username")
  await page.click("input[type='submit'][value='Add User']")
  await page.waitForSelector(removeUserCheckboxSelector)

  // remove user
  await page.click(removeUserCheckboxSelector)
  await page.click("input[type='submit'][value='Remove Selected Users']")

  await page.waitForFunction(() => !document.querySelector("input[type='checkbox'][name='usersToRemove']"))
}

export const cannotReallocateCase = async function (this: Bichard) {
  const reallocateBtn = await this.browser.page.$("#reallocateAction")
  expect(reallocateBtn).toBeFalsy()
}

export const checkTriggerforOffence = async function (this: Bichard, triggerId: string, offenceId: string) {
  await checkDataTable(this, [
    { column: 1, value: triggerId, exact: false },
    { column: 2, value: offenceId, exact: true }
  ])
}

export const checkCompleteTriggerforOffence = async function (this: Bichard, triggerId: string, offenceId: string) {
  await checkDataTable(this, [
    { column: 1, value: triggerId, exact: false },
    { column: 2, value: offenceId, exact: true },
    { column: 3, value: "Complete", exact: true }
  ])
}

export const checkTrigger = async function (this: Bichard, triggerId: string) {
  await checkDataTable(this, [{ column: 1, value: triggerId, exact: false }])
}

export const resolveAllTriggers = async function (this: Bichard) {
  await this.browser.page.$$eval("input[name='triggerMarkedAsCompleteList']", (elHandle) =>
    elHandle.forEach((el) => el.click())
  )

  await Promise.all([
    this.browser.page.click("input[value='Mark Selected Complete']"),
    this.browser.page.waitForNavigation()
  ])
}

export const resolveSelectedTriggers = async function (this: Bichard) {
  await Promise.all([
    this.browser.page.click("input[value='Mark Selected Complete']"),
    this.browser.page.waitForNavigation()
  ])
}

export const manuallyResolveRecord = async function (this: Bichard) {
  await Promise.all([
    this.browser.page.click("input[value='Select All Triggers']"),
    this.browser.page.waitForNavigation()
  ])
  await Promise.all([
    this.browser.page.click("input[value='Mark Selected Complete']"),
    this.browser.page.waitForNavigation()
  ])
  await Promise.all([
    this.browser.page.click("input[value='Mark As Manually Resolved']"),
    this.browser.page.waitForNavigation()
  ])
  await this.browser.page.select("select#reasonCode", "2")
  await Promise.all([this.browser.page.click("input[value='OK']"), this.browser.page.waitForNavigation()])
}

const filterRecords = async function (world: Bichard, resolvedType: string, recordType: string) {
  const recordSelectId = { record: "0", exception: "1", trigger: "2" }[recordType.toLowerCase()]
  if (!recordSelectId) {
    throw new Error(`Record type '${recordType}' is unknown`)
  }

  await world.browser.page.waitForSelector("select#exceptionTypeFilter")
  await world.browser.page.select("select#exceptionTypeFilter", recordSelectId)

  const resolutionSelectId = { unresolved: "1", resolved: "2" }[resolvedType.toLowerCase()]
  if (!resolutionSelectId) {
    throw new Error(`Resolution type '${resolvedType}' is unknown`)
  }

  await world.browser.page.select("select#resolvedFilter", resolutionSelectId)

  await Promise.all([world.browser.page.click("input[value='Refresh']"), world.browser.page.waitForNavigation()])
}

export const checkRecordResolved = async function (
  this: Bichard,
  recordType: string,
  recordName: string,
  resolvedType: string
) {
  await filterRecords(this, resolvedType, recordType)
  expect(await this.browser.elementText("table.resultsTable")).toMatch(recordName)
}

export const checkRecordForThisTestResolved = async function (this: Bichard, recordType: string, resolvedType: string) {
  await filterRecords(this, resolvedType, recordType)
  expect(await this.browser.elementText("table.resultsTable")).toMatch(this.getRecordName())
}

export const checkRecordNotResolved = async function (
  this: Bichard,
  recordType: string,
  recordName: string,
  resolvedType: string
) {
  await filterRecords(this, resolvedType, recordType)
  expect(await this.browser.elementText("table.resultsTable")).not.toMatch(recordName)
}

export const checkRecordForThisTestNotResolved = async function (
  this: Bichard,
  recordType: string,
  resolvedType: string
) {
  await filterRecords(this, resolvedType, recordType)
  expect(await this.browser.elementText("table.resultsTable")).not.toMatch(this.getRecordName())
}

export const checkRecordNotExists = async function (this: Bichard, recordName: string) {
  await this.browser.page.waitForSelector("input[value='Refresh']")
  await this.browser.clickAndWait("input[value='Refresh']")
  expect(await this.browser.pageText()).not.toMatch(recordName)
}

export const viewOffence = async function (this: Bichard, offenceId: string) {
  await this.browser.clickLinkAndWait(offenceId)
}

export const checkOffenceData = async function (this: Bichard, value: string, key: string) {
  await checkDataTable(this, [
    { column: 1, value: key, exact: true },
    { column: 2, value, exact: true }
  ])
}

export const checkNoteExists = async function (this: Bichard, value: string) {
  const tableData = await getTableData(this, "#br7_exception_details_display_notes .resultsTable tbody tr")
  if (!tableData.some((row) => row[0].includes(value))) {
    throw new Error("Note does not exist")
  }
}

export const checkOffenceDataError = async function (this: Bichard, value: string, key: string) {
  await checkDataTable(this, [
    { column: 1, value: key, exact: true },
    { column: 3, value, exact: false }
  ])
}

export const returnToCaseListUnlock = async function (this: Bichard) {
  await this.browser.clickAndWait("input[type='submit'][value='Return To List (Unlock)']")
  const yesButton = await this.browser.page.$("input[type='submit'][value='Yes']")
  if (yesButton) {
    await this.browser.clickAndWait("input[type='submit'][value='Yes']")
  }
}

export const correctOffenceException = async function (this: Bichard, field: string, newValue: string) {
  await this.browser.page.$$("#br7_exception_details_court_data_table .resultsTable tbody tr").then((rows) =>
    rows.map((row) =>
      row.evaluate(
        (rowEl, fieldName, value) => {
          const tds = Array.from(rowEl.querySelectorAll("td")).map((e) => e.innerText.trim())
          if (tds[0] === fieldName) {
            let input: HTMLInputElement | HTMLTextAreaElement | null =
              rowEl.querySelector<HTMLInputElement>("input[type='text']")
            if (!input) {
              input = rowEl.querySelector("textarea")
            }

            if (input) {
              input.value = value
            }
          }
        },
        field,
        newValue
      )
    )
  )
}

export const matchOffence = async function (this: Bichard, sequenceNumber: string) {
  await correctOffenceException.bind(this)("Sequence Number", sequenceNumber)
}

export const matchOffenceAndCcr = async function (this: Bichard, sequenceNumber: string, ccr: string) {
  await correctOffenceException.bind(this)("Sequence Number", sequenceNumber)
  await correctOffenceException.bind(this)("Court Case Ref", ccr)
}

export const correctOffenceFreeTextException = async function (this: Bichard, field: string, newValue: string) {
  await this.browser.page.$$("#br7_exception_details_court_data_table .resultsTable tbody tr").then((rows) =>
    rows.map((row) =>
      row.evaluate(
        (rowEl, fieldName, value) => {
          const tds = Array.from(rowEl.querySelectorAll("td")).map((e) => e.innerText.trim())
          if (tds[0] === fieldName) {
            const input = rowEl.querySelector<HTMLInputElement>("textarea")
            if (input) {
              input.value = value + input.value
            }
          }
        },
        field,
        newValue
      )
    )
  )
}

export const submitRecord = async function (this: Bichard) {
  await this.browser.clickAndWait("input[type='submit'][value='Submit']")
  await this.browser.clickAndWait("input[type='submit'][value='OK']")
}

export const submitUnchangedRecord = async function (this: Bichard) {
  await this.browser.clickAndWait("input[type='submit'][value='Submit']")
  await this.browser.page.click("input[name='acknowledgedExceptionNotChanged']")
  await this.browser.clickAndWait("input[type='submit'][value='OK']")
}

export const reloadUntilStringPresent = async function (this: Bichard, content: string) {
  const result = await reloadUntilContent(this.browser.page, content)
  expect(result).toBeTruthy()
}

export const reloadUntilStringPresentForRecord = async function (this: Bichard, content: string) {
  await filterByRecordName(this)
  const result = await reloadUntilContent(this.browser.page, content)
  expect(result).toBeTruthy()
}

export const reloadUntilStringNotPresent = async function (this: Bichard, content: string) {
  const result = await reloadUntilNotContent(this.browser.page, content)
  expect(result).toBeTruthy()
}

export const checkNoExceptions = async function (this: Bichard) {
  await filterRecords(this, "unresolved", "exception")
  const tableRows = await this.browser.page.$$("table.resultsTable tr")
  expect(tableRows.length).toEqual(2)
}

export const checkNoExceptionsForThis = async function (this: Bichard) {
  const name = this.getRecordName()
  await filterRecords(this, "unresolved", "exception")
  const links = await this.browser.page.$$(`.resultsTable a.br7_exception_list_record_table_link[title^='${name}']`)
  expect(links.length).toEqual(0)
}

export const checkNoRecords = async function (this: Bichard) {
  await filterRecords(this, "unresolved", "record")

  const tableRows = await this.browser.page.$$("table.resultsTable tr")
  expect(tableRows.length).toEqual(2)
}

export const checkNoRecordsForThis = async function (this: Bichard) {
  const name = this.getRecordName()
  if (this.config.noUi) {
    // Read the records direct from the DB
    const records = await this.db.getMatchingErrorRecords(name)
    expect(records.length).toEqual(0)
  } else {
    // Check for no exceptions of triggers via the UI
    await filterRecords(this, "unresolved", "record")
    const links = await this.browser.page.$$(`.resultsTable a.br7_exception_list_record_table_link[title^='${name}']`)
    expect(links.length).toEqual(0)
  }
}

export const waitForRecordStep = async function (this: Bichard, record: string) {
  await reloadUntilContent(this.browser.page, record)
}

export const checkOffence = async function (this: Bichard, offenceCode: string, offenceId: string) {
  await checkDataTable(this, [
    { column: 2, value: offenceId, exact: true },
    { column: 4, value: offenceCode, exact: true }
  ])
}

export const checkTableRows = async function (this: Bichard, offenceCount: string) {
  const trPromises = await this.browser.page.$$("#br7_exception_details_court_data_table .resultsTable tbody tr")
  expect(trPromises.length).toEqual(parseInt(offenceCount, 10))
}

export const checkRecordRows = async function (this: Bichard, recordCount: string) {
  const trPromises = await this.browser.page.$$(
    "#br7_exception_list_records .resultsTable tbody tr a.br7_exception_list_record_table_link"
  )
  expect(trPromises.length).toEqual(parseInt(recordCount, 10))
}

export const selectTrigger = async function (this: Bichard, triggerNo: string) {
  const checkBoxes = await this.browser.page.$$(
    "#br7_exception_details_court_data_table .resultsTable tbody tr input[type=checkbox]"
  )
  const index = parseInt(triggerNo, 10) - 1
  await checkBoxes[index].click()
}

export const switchBichard = async function (this: Bichard) {
  await Promise.all([this.browser.page.click(".wpsToolBarBichardSwitch button"), this.browser.page.waitForNavigation()])

  await this.browser.page.waitForSelector(".moj-header__logo")
}

export const cannotSeeBichardSwitcher = async function (this: Bichard) {
  const bichardSwitcher = await this.browser.page.$$(".wpsToolBarBichardSwitch")
  expect(bichardSwitcher.length).toEqual(0)
}

export const returnToList = async function (this: Bichard) {
  const returnButton =
    (await this.browser.page.$("[value='Return To List']")) ||
    (await this.browser.page.$("[value='Return To List (Unlock)']")) ||
    (await this.browser.page.$("[value='Return To List (Lock)']"))

  if (!returnButton) {
    throw new Error("Could not find return to list button")
  }

  await Promise.all([returnButton.click(), this.browser.page.waitForNavigation()])
}

export const saveChanges = async function (this: Bichard) {
  await this.browser.clickAndWait("input[type='submit'][value='Yes']")
}

export const checkCorrectionFieldAndValue = async function (this: Bichard, field: string, expectedValue: string) {
  const inputField = await this.browser.page.$eval(
    `xpath/.//*/tbody/tr/td[contains(text(), "${field}")]/following-sibling::td[3]/input`,
    (input) => (input as HTMLInputElement).value
  )

  expect(inputField).toEqual(expectedValue)
}
