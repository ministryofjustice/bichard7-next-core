import forces from "@moj-bichard7-developers/bichard7-next-data/dist/data/forces.json"
import { expect } from "expect"
import type { KeyInput, Page } from "puppeteer"
import type BrowserHelper from "../helpers/BrowserHelper"
import {
  delay,
  reloadUntilContent,
  reloadUntilContentInSelector,
  reloadUntilNotContent,
  reloadUntilXPathSelector
} from "./puppeteer-utils"
import { caseListPage } from "./urls"
import type Bichard from "./world"

const waitForRecord = (name: string | null, page: Page, reloadAttempts?: number) => {
  const selector = `xpath/.//table/tbody/tr${name ? `[contains(.,"${name}")]` : ""}`

  return reloadUntilXPathSelector(page, selector, reloadAttempts)
}

const convertFieldToHtml = (field: string) => field.toLowerCase().replaceAll(" ", "-")

const resetFilters = async function (browser: BrowserHelper) {
  await browser.clickAndWait("#clear-filters")
}

// This function needs to wrap the resetFilters fuction to work if it's being called from UI Steps
export const clearFilters = async function (this: Bichard) {
  await resetFilters(this.browser)
}

const filterByRecordName = async function (world: Bichard) {
  const name = world.getRecordName()
  const searchField = "input[name='defendantName']"
  await world.browser.page.click(searchField, { clickCount: 3 })
  await world.browser.page.type(searchField, name)
  await Promise.all([world.browser.page.click("button#search"), world.browser.page.waitForNavigation()])
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

const getShortTriggerCode = (triggerCode: string) => {
  const triggerCodeDetails = triggerCode.match(/TR(?<triggerType>\w{2})(?<triggerCode>\d+)/)?.groups
  return `${triggerCodeDetails?.triggerType}${String(Number(triggerCodeDetails?.triggerCode)).padStart(2, "0")}`
}

type TriggerElement = {
  triggerCode?: string
  offenceId?: number
  status?: string
  exact?: boolean
}

const getTriggersFromPage = async (world: Bichard): Promise<TriggerElement[]> => {
  await world.browser.page.waitForSelector("section#triggers .moj-trigger-row")
  const triggerRows = await world.browser.page.$$("section#triggers .moj-trigger-row")

  const triggers = await Promise.all(
    triggerRows.map(async (row) => {
      const triggerCode = await row.evaluate((element) =>
        element.querySelector<HTMLElement>("label.trigger-code")?.innerText?.trim()
      )
      const offenceId = Number(
        await row.evaluate(
          (element) =>
            element
              .querySelector<HTMLElement>("button.moj-action-link")
              ?.innerText?.trim()
              ?.match(/Offence (?<offenceId>\d+)/)?.groups?.offenceId
        )
      )
      return { triggerCode, offenceId }
    })
  )

  return triggers
}

const doesTriggerMatch = (actualTrigger: TriggerElement, expectedTrigger: TriggerElement) => {
  const triggerCodeMatch = actualTrigger.triggerCode === getShortTriggerCode(expectedTrigger.triggerCode ?? "")
  const offenceIdMatch = !expectedTrigger.offenceId || actualTrigger.offenceId === Number(expectedTrigger.offenceId)

  return triggerCodeMatch && offenceIdMatch
}

const checkTriggers = async (world: Bichard, expectedTriggers: TriggerElement[]) => {
  const actualTriggers = await getTriggersFromPage(world)
  const matchedTriggers = expectedTriggers.filter((expectedTrigger) =>
    actualTriggers.some((actualTrigger) => doesTriggerMatch(actualTrigger, expectedTrigger))
  )

  expect(matchedTriggers.length).toEqual(expectedTriggers.length)
}

export const checkTriggerforOffence = async function (this: Bichard, triggerCode: string, offenceId: number) {
  await checkTriggers(this, [
    {
      triggerCode,
      offenceId
    }
  ])
}

export const checkCompleteTriggerforOffence = async function (this: Bichard, triggerCode: string, offenceId: number) {
  await checkTriggers(this, [{ triggerCode, offenceId, status: "Complete" }])
}

export const checkTrigger = async function (this: Bichard, triggerCode: string) {
  await checkTriggers(this, [{ triggerCode, exact: false }])
}

export const findRecordFor = async function (this: Bichard, name: string) {
  expect(await this.browser.pageText()).toContain(name)
}

export const checkNoPncErrors = async function (this: Bichard, name: string) {
  const [recordLink] = await this.browser.page.$$(`xpath/.//table/tbody/tr/*/a[contains(text(),"${name}")]`)
  await recordLink.click()

  await this.browser.page.waitForSelector("text=PNC errors")
  await this.browser.clickAndWait("text=PNC errors")
  // TODO: assert no PNC errors once we have the table
}

export const checkOffenceData = async function (this: Bichard, value: string, key: string) {
  // const [cell] = await this.browser.page.$$(`xpath/.//table//td[contains(.,"${key}")]/following-sibling::td`);
  // case-sensitivity hack because old bichard capitalises every word and new bichard does not

  const [cellContent] = await this.browser.page.$$eval(
    `xpath/.//table//td[contains(
        translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
        "${key.toLowerCase()}"
      )]/following-sibling::td`,
    (cells) => cells.map((cell) => cell.textContent)
  )

  expect(cellContent).toBe(value)
}

export const checkOffence = function (offenceCode: string, offenceId: string) {
  console.log("Check offence", offenceCode, offenceId)
  throw Error("Not yet implemented.")
}

export const openRecordFor = async function (this: Bichard, name: string) {
  await waitForRecord(name, this.browser.page)

  const [link] = await this.browser.page.$$(`xpath/.//table/tbody/tr/*/a[contains(.,"${name}")]`)

  await Promise.all([link.click(), this.browser.page.waitForNavigation()])
}

export const openRecordForCurrentTest = async function (this: Bichard) {
  await filterByRecordName(this)
  await waitForRecord(this.getRecordName(), this.browser.page)
  const [recordLink] = await this.browser.page.$$(
    `xpath/.//table/tbody/tr/*/a[contains(text(),"${this.getRecordName()}")]`
  )
  await Promise.all([recordLink.click(), this.browser.page.waitForNavigation()])
  await this.browser.page.waitForSelector("text=Case details")
}

export const loadTab = async function (this: Bichard, tabName: string) {
  if (["Triggers", "Exceptions"].includes(tabName)) {
    await this.browser.page.click(`#${tabName.toLowerCase()}-tab`)
    return
  }

  const backToAllOffencesLink = await this.browser.page.$$(".govuk-back-link")

  if (tabName === "Offences" && backToAllOffencesLink.length > 0) {
    await backToAllOffencesLink[0].click()
    return
  }

  await this.browser.page.click(`text=${tabName}`)
}

export const returnToOffenceList = async function (this: Bichard) {
  const [back] = await this.browser.page.$$('xpath/.//*[contains(text(), "Back to all offences")]')
  await back.click()
}

export const reallocateCaseToForce = async function (this: Bichard, force: string) {
  const { page } = this.browser

  await this.browser.clickAndWait("text=Reallocate Case")
  const selectedForceCode = { BTP: "93", Merseyside: "05", Metropolitan: "02" }[force]
  const forceDetails = forces.find((x) => x.code === selectedForceCode)
  if (!forceDetails) {
    throw new Error("Could not find force code")
  }

  const optionValue = await page.evaluate((f) => {
    const select = document.querySelector<HTMLSelectElement>('select[name="force"]')
    if (!select) {
      return
    }

    const options = Array.from(select?.options)
    const dropdownTextToSelect = `${f.code} - ${f.name}`
    const option = options.find((o) => o.text === dropdownTextToSelect)
    return option?.value
  }, forceDetails)

  if (!optionValue) {
    throw new Error("Could not find option for force code")
  }

  await page.select('select[name="force"]', optionValue)
  await this.browser.clickAndWait("#Reallocate")
}

export const canSeeContentInTable = async function (this: Bichard, value: string) {
  let newValue = value
  if (value === "(Submitted)" || value === "(Resolved)") {
    newValue = newValue.replace(/[()]/g, "").toUpperCase()
  }

  const found = await reloadUntilContentInSelector(this.browser.page, newValue, "table.cases-list > tbody")
  expect(found).toBeTruthy()
}

export const cannotSeeContentInTable = async function (this: Bichard, value: string) {
  const found = await reloadUntilContentInSelector(this.browser.page, value, "table.cases-list > tbody", 2)
  expect(found).toBeFalsy()
}

export const canSeeContentInTableForThis = async function (this: Bichard, value: string) {
  await filterByRecordName(this)

  const found = await reloadUntilContentInSelector(this.browser.page, value, "table.cases-list > tbody")
  expect(found).toBeTruthy()
}

export const cannotSeeTrigger = async function (this: Bichard, value: string) {
  await waitForRecord(null, this.browser.page, 2)
  const noCasesMessageMatch = await this.browser.page.$$(
    `xpath/.//table[@class="cases-list"]//tbody//*[contains(text(),"${value}")]`
  )
  expect(noCasesMessageMatch.length).toEqual(0)
}

export const noExceptionPresentForOffender = async function (this: Bichard, name: string) {
  // Filter for exceptions
  await this.browser.page.waitForSelector("#exceptions-reason")
  await this.browser.page.click("#exceptions-reason")

  await Promise.all([this.browser.page.click("button#search"), this.browser.page.waitForNavigation()])

  const noCaseNamesMatch = await this.browser.page.$$(`xpath/.//*[contains(text(), "${name}")]`)
  expect(noCaseNamesMatch.length).toEqual(0)

  const noCasesMessageMatch = await this.browser.page.$$(
    'xpath/.//*[contains(text(), "There are no court cases to show")]'
  )
  expect(noCasesMessageMatch.length).toEqual(1)

  await resetFilters(this.browser)
}

const markTriggersComplete = async function (world: Bichard) {
  await world.browser.clickAndWait("#mark-triggers-complete-button")
}

export const resolveSelectedTriggers = async function (this: Bichard) {
  await markTriggersComplete(this)
}

export const resolveAllTriggers = async function (this: Bichard) {
  const [selectAllLink] = await this.browser.page.$$("#select-all-triggers button")
  await selectAllLink.evaluate((e) => e.click())
  await markTriggersComplete(this)
}

export const selectTriggerToResolve = async function (this: Bichard, triggerNumber: string) {
  const checkbox = (await this.browser.page.$$(".moj-trigger-row input[type=checkbox]"))[Number(triggerNumber) - 1]
  await checkbox.click()
}

export const manuallyResolveRecord = async function (this: Bichard) {
  await this.browser.page.click("#exceptions-tab")
  await Promise.all([
    await this.browser.page.click("section#exceptions a[href*='resolve'] button"),
    await this.browser.page.waitForNavigation()
  ])

  await Promise.all([await this.browser.page.click("#Resolve"), await this.browser.page.waitForNavigation()])
}

export const exceptionResolutionStatus = async function (this: Bichard, resolutionStatus: string) {
  await this.browser.page.click("#exceptions-tab")

  const resolution = resolutionStatus.split(" ").length > 1 ? resolutionStatus.split(" ")[1] : resolutionStatus

  const headerResolutionStatus = await this.browser.page.$$(
    `xpath/.//div[@id = "header-container"]//div[contains(@class, "exceptions-${resolution.toLowerCase()}-tag") and text() = "${resolutionStatus}"]`
  )
  const exceptionsPanelResolutionStatus = await this.browser.page.$$(
    `xpath/.//section[@id = "exceptions"]//div[contains(@class, "exceptions-${resolution.toLowerCase()}-tag") and text() = "${resolutionStatus}"]`
  )

  expect(headerResolutionStatus.length).toEqual(1)
  expect(exceptionsPanelResolutionStatus.length).toEqual(1)
}

export const exceptionResolutionStatusOnCaseDetails = async function (this: Bichard, resolutionStatus: string) {
  const { page } = this.browser

  const headerResolutionStatus = await page.$$(
    `xpath/.//div[@id = "header-container"]//div[contains(@class, "exceptions-${resolutionStatus.toLowerCase()}-tag") and text() = "${resolutionStatus}"]`
  )
  expect(headerResolutionStatus.length).toEqual(1)

  await page.click("#exceptions-tab")
  const exceptionsPanelResolutionStatus = await page.$$(
    `xpath/.//section[@id = "exceptions"]//div[contains(@class, "exceptions-${resolutionStatus.toLowerCase()}-tag") and text() = "${resolutionStatus}"]`
  )
  expect(exceptionsPanelResolutionStatus.length).toEqual(0)
}

const filterRecords = async function (world: Bichard, resolvedType: string, recordType: string) {
  if (resolvedType.toLowerCase() === "resolved") {
    await world.browser.page.click("input#resolved")
  }

  if (recordType.toLowerCase() === "exception") {
    await world.browser.page.click("input#exceptions-reason")
  } else if (recordType.toLowerCase() === "trigger") {
    await world.browser.page.click("input#trigger-type")
  }

  await Promise.all([world.browser.page.click("button#search"), world.browser.page.waitForNavigation()])
}

export const checkRecordForThisTestResolved = async function (
  this: Bichard,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _recordType: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _resolvedType: string
) {
  // TODO: Currently there is no way of filtering for resolved cases, we need to update next UI and update this test
  const resolveTriggersButtons = await this.browser.page.$$(
    "#Triggers_table .src__StyledButton-sc-19ocyxv-0:not([disabled])"
  )

  expect(resolveTriggersButtons.length).toEqual(0)
}

export const checkRecordForThisTestNotResolved = async function (
  this: Bichard,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _recordType: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _resolvedType: string
) {
  // TODO: Currently there is no way of filtering for resolved cases, we need to update next UI and update this test
  const resolveTriggersButtons = await this.browser.page.$$(
    "#Triggers_table .src__StyledButton-sc-19ocyxv-0:not([disabled])"
  )

  expect(resolveTriggersButtons.length).toEqual(0)
}

export const checkNoExceptions = async function (this: Bichard) {
  await filterRecords(this, "unresolved", "exception")
  const noCasesMessageMatch = await this.browser.page.$$(
    'xpath/.//*[contains(text(), "There are no court cases to show")]'
  )
  expect(noCasesMessageMatch.length).toEqual(1)
}

export const checkNoExceptionsForThis = async function () {
  // TODO: Fix this step to check record has no exceptions
}

export const checkNoRecords = async function (this: Bichard) {
  await filterRecords(this, "unresolved", "record")

  const noCasesMessageMatch = await this.browser.page.$$(
    'xpath/.//*[contains(text(), "There are no court cases to show")]'
  )
  expect(noCasesMessageMatch.length).toEqual(1)
}

export const checkNoRecordsForThis = async function (this: Bichard) {
  const name = this.getRecordName()
  if (this.config.noUi) {
    // Read the records direct from the DB
    const records = await this.db.getMatchingErrorRecords(name)
    expect(records.length).toEqual(0)
  } else {
    const didFoundText = await reloadUntilXPathSelector(
      this.browser.page,
      'xpath/.//*[contains(text(), "There are no court cases to show")]'
    )
    expect(didFoundText).toEqual(true)
  }
}

export const nRecordsInList = async function (this: Bichard, n: number) {
  const records = await this.browser.page.$$("[class*='caseDetailsRow']")
  // TODO: change "there should only be {string} records"
  // to "there should only be {int} records" once old
  // steps are removed - remove coercion below
  expect(`${records.length}`).toBe(n)
}

// TODO: review whether this is specific enough
export const nRecordsForPerson = async function (this: Bichard, n: number, name: string) {
  const records = await this.browser.page.$$(`xpath/.//tr/td/a[text()[contains(.,'${name}')]]`)
  expect(records.length).toEqual(n)
}

export const noRecordsForPerson = async function (this: Bichard, name: string) {
  await nRecordsForPerson.apply(this, [0, name])
}

export const goToExceptionList = async function (this: Bichard) {
  if (this.config.noUi) {
    return
  }

  await Promise.all([this.browser.page.waitForNavigation(), this.browser.page.goto(caseListPage())])
}

// TODO: refactor down with noExceptionsPresentForOffender
export const noTriggersPresentForOffender = async function (this: Bichard, name: string) {
  await this.browser.page.waitForSelector("#triggers-reason")
  await this.browser.page.click("#triggers-reason")

  await Promise.all([this.browser.page.click("button#search"), this.browser.page.waitForNavigation()])

  const noCaseNamesMatch = await this.browser.page.$$(`xpath/.//*[contains(text(), "${name}")]`)
  expect(noCaseNamesMatch.length).toEqual(0)

  const noCasesMessageMatch = await this.browser.page.$$(
    'xpath/.//*[contains(text(), "There are no court cases to show")]'
  )
  expect(noCasesMessageMatch.length).toEqual(1)

  await resetFilters(this.browser)
}

const correctOffence = async (page: Page, fieldHtml: string, newValue: string) => {
  const inputId = `input#${fieldHtml}`

  // Get the length of existing value
  const elementLength = await page.$eval(inputId, (e) => (e as HTMLInputElement).value.length)

  await page.focus(inputId)

  // Delete the existing input, triggers a change event.
  if (elementLength > 0) {
    new Array(elementLength).fill(0).forEach(async () => {
      await page.keyboard.press("Delete")
      await page.keyboard.press("Backspace")
    })
  }

  await page.focus(inputId)
  await page.keyboard.type(newValue, { delay: 100 })
}

export const correctOffenceException = async function (this: Bichard, field: string, newValue: string) {
  const { page } = this.browser

  await correctOffence(page, convertFieldToHtml(field), newValue)

  try {
    await page.waitForSelector(".success-message", { timeout: 500 })
  } catch {
    await page.waitForSelector(".error-message", { timeout: 500 })
  }
}

export const correctOffenceExceptionByTypeahead = async function (this: Bichard, field: string, newValue: string) {
  const { page } = this.browser

  await correctOffence(page, convertFieldToHtml(field), newValue)
}

export const matchOffence = async function (this: Bichard, sequenceNumber: string) {
  const { page } = this.browser
  const selector = "select.offence-matcher"

  await page.waitForSelector(selector)
  await page.select(selector, sequenceNumber)
}

export const matchOffenceAndCcr = async function (this: Bichard, sequenceNumber: string, ccr: string) {
  const { page } = this.browser
  const selector = "select.offence-matcher"

  await page.waitForSelector(`${selector} option[value]`)

  await page.select(selector, `${sequenceNumber}-${ccr}`)
}

export const offenceAddedInCourt = async function (this: Bichard) {
  await this.browser.page.select("select.offence-matcher", "0")
}

export const selectTheFirstOption = async function (this: Bichard) {
  const { page } = this.browser

  // API request happens too slow for puppeteer
  await delay(0.5)

  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")

  await page.waitForSelector(".success-message")
}

export const returnToCaseListUnlock = async function (this: Bichard) {
  const { page } = this.browser
  const pageTitle = await page.title()
  if (pageTitle.endsWith("Case List")) {
    return
  }

  await Promise.all([page.click("#leave-and-unlock, #return-to-case-list"), page.waitForNavigation()])
}

export const waitForRecordStep = async function (this: Bichard, record: string) {
  await reloadUntilContent(this.browser.page, record)
}

export const checkNoteExists = async function (this: Bichard, value: string) {
  const rows = await getTableData(this, ".notes-table tbody tr")
  if (!rows.some((row) => row.some((cell) => cell.toLowerCase().includes(value.toLowerCase())))) {
    throw new Error("Note does not exist")
  }
}

const legacyToNextButtonTextMappings: Record<string, string> = {
  "Mark Selected Complete": "Mark trigger(s) as complete",
  Refresh: "Case list"
}

export const clickButton = async function (this: Bichard, value: string) {
  let newValue = value
  if (legacyToNextButtonTextMappings[value]) {
    newValue = legacyToNextButtonTextMappings[value]
  }

  await this.browser.clickAndWait(`text=${newValue}`)
}

export const switchBichard = async function (this: Bichard) {
  const { page } = this.browser
  await Promise.all([page.click(".BichardSwitch"), page.waitForNavigation()])

  // if feedback page is shown
  const skip = await page.$("button[id='skip-feedback']")
  if (skip) {
    await Promise.all([skip.click(), page.waitForNavigation()])
  }
}

export const viewOffence = async function (this: Bichard, offenceId: string) {
  await this.browser.page.waitForSelector(`#offence-${offenceId}`)
  await this.browser.page.click(`#offence-${offenceId}`)
}

export const viewOffenceByText = async function (this: Bichard, text: string) {
  const [link] = await this.browser.page.$$(`xpath/.//a[contains(text(), "${text}")]`)
  await link.click()
}

export const submitRecord = async function (this: Bichard) {
  const { page } = this.browser

  await page.click("#exceptions-tab")
  await Promise.all([page.click("#submit"), page.waitForNavigation()])
  await Promise.all([page.click("#confirm-submit"), page.waitForNavigation()])
  await Promise.all([page.click("#return-to-case-list"), page.waitForNavigation()])
}

export const submitRecordAndStayOnPage = async function (this: Bichard) {
  const { page } = this.browser

  await page.click("#exceptions-tab")
  await Promise.all([page.click("#submit"), page.waitForNavigation()])
  await Promise.all([page.click("#confirm-submit"), page.waitForNavigation()])
}

export const reloadUntilStringPresent = async function (this: Bichard, value: string) {
  const result = await reloadUntilContent(this.browser.page, value)
  expect(result).toBeTruthy()
}

export const reloadUntilStringNotPresent = async function (this: Bichard, content: string) {
  const contentSansParentheses = content.replace(/[()]/g, "")
  const result = await reloadUntilNotContent(this.browser.page, contentSansParentheses.toUpperCase())
  expect(result).toBeTruthy()
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const checkOffenceDataError = async function (this: Bichard, value: string, _key: string) {
  const found = await reloadUntilContentInSelector(this.browser.page, value, "#exceptions")
  expect(found).toBeTruthy()
}

export const checkRecordStatus = async function (
  this: Bichard,
  recordType: string,
  recordName: string,
  resolvedType: string
) {
  const { page } = this.browser

  await Promise.all([filterRecords(this, resolvedType, recordType), page.waitForNavigation()])
  expect(await this.browser.elementText("table.cases-list")).toMatch(recordName)

  await resetFilters(this.browser)

  await page.waitForFunction(() => !document.querySelector("#clear-filters"), { polling: "mutation" })
}

export const checkRecordNotStatus = async function (
  this: Bichard,
  recordType: string,
  _recordName: string,
  resolvedType: string
) {
  const { page } = this.browser

  await Promise.all([filterRecords(this, resolvedType, recordType), page.waitForNavigation()])

  const noCasesMessageMatch = await page.$$('xpath/.//*[contains(text(), "There are no court cases to show")]')

  expect(noCasesMessageMatch.length).toEqual(1)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const invalidFieldCanBeSubmitted = async function (this: Bichard, _fieldName: string) {
  const { page } = this.browser

  await page.click("#exceptions-tab")

  const submitDisabled = await page.$eval("#submit", (submitButton) => (submitButton as HTMLInputElement).disabled)
  expect(submitDisabled).toBeFalsy()
}

export const checkCorrectionFieldAndValue = async function (this: Bichard, fieldName: string, value: string) {
  const { page } = this.browser
  const fieldNameId = `#${convertFieldToHtml(fieldName)}`

  const correctionValue = await page.$eval(fieldNameId, (field) => (field as HTMLInputElement).value)
  expect(correctionValue).toEqual(value)
}

export const reload = async function (this: Bichard) {
  const { page } = this.browser
  await page.reload()
}

export const inputFieldToKeyboardPress = async function (this: Bichard, field: string, keyboardButton: KeyInput) {
  const { page } = this.browser

  const inputField = `input#${convertFieldToHtml(field)}`

  await page.focus(inputField)

  await page.keyboard.press(keyboardButton)
}

export const seeCorrectionBadge = async function (this: Bichard) {
  const { page } = this.browser

  await page.$$('xpath/.//span[contains(@class, "moj-badge") and text() = "Correction"]')
}

export const goToExceptionPage = async function (this: Bichard, exception: string) {
  const { page } = this.browser

  const [link] = await page.$$(`xpath/.//table/tbody/tr[contains(.,"${exception}")]//a`)

  await Promise.all([link.click(), this.browser.page.waitForNavigation()])
}

export const removeYear = async function (this: Bichard, field: string) {
  const { page } = this.browser

  const inputField = `input#${convertFieldToHtml(field)}`

  await page.focus(inputField)

  await page.keyboard.press("Backspace")
}

export const seeError = async function (this: Bichard, errorMessage: string) {
  const { page } = this.browser

  await page.$$(`xpath/.//div[@class = "error-message"]//*[text() = "${errorMessage}"]`)
}

export const filter = async function (this: Bichard, fieldName: string, value: string) {
  const { page } = this.browser
  const fieldNameId = `#${fieldName}`

  await page.focus(fieldNameId)
  await page.keyboard.type(value, { delay: 100 })
}
