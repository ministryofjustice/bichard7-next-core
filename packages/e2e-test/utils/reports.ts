import { expect } from "expect"
import fs from "fs"

// eslint-disable-next-line import/no-unresolved
import { parse } from "csv-parse/sync"
import { getRawTableData, getTableData } from "./actions.legacy-ui"
import type Bichard from "./world"

export const accessReport = async function (this: Bichard, report: string) {
  const [, reportsBtn] = await this.browser.page.$$("span.wpsNavLevel1")
  await Promise.all([reportsBtn.click(), this.browser.page.waitForNavigation()])
  await this.browser.clickLinkAndWait(report)
  await expect(await this.browser.pageText()).toMatch(report)
}

export const generateTodaysReport = async function (this: Bichard) {
  await this.browser.page.select(".resultsTable select[name='fromDate']", "0")
  await this.browser.page.select(".resultsTable select[name='toDate']", "0")

  await Promise.all([this.browser.page.click("input[value='Run report']"), this.browser.page.waitForNavigation()])
}

export const reportContains = async function (this: Bichard, text: string) {
  expect(await this.browser.elementText("#br7_report_data tbody")).toContain(text)
}

export const reportDoesNotContain = async function (this: Bichard, text: string) {
  expect(await this.browser.elementText("#br7_report_data tbody")).not.toContain(text)
}

export const fakeTriggerReportData = async function (this: Bichard) {
  await this.db.query(
    "update br7own.error_list set msg_received_ts = msg_received_ts - INTERVAL '7 days' where trigger_reason = 'TRPR0003'"
  )
  await this.db.query(
    "update br7own.error_list set msg_received_ts = msg_received_ts - INTERVAL '8 days' where trigger_reason IN ('TRPR0001', 'TRPR0006', 'TRPR0012')"
  )
}

export const fakeLiveStatusExceptionsReportData = async function (this: Bichard) {
  await this.db.query(
    "update br7own.error_list set msg_received_ts = msg_received_ts - INTERVAL '7 days' where trigger_reason = 'TRPR0006'"
  )
}

export const checkUserSummaryReport = async function (this: Bichard) {
  const now = new Date()
  const todayString = `${now.getUTCDate().toString().padStart(2, "0")} ${now
    .toDateString()
    .slice(4, 7)} ${now.getUTCFullYear()}`
  const tableData = await getTableData(this, "#br7_report_data .resultsTable tbody tr")
  expect(tableData[0][0]).toEqual(todayString)
  expect(tableData[2]).toEqual(["exceptionhandler", "1", "0", "0"])
  expect(tableData[3]).toEqual(["generalhandler", "0", "3", "0"])
  expect(tableData[4]).toEqual(["triggerhandler", "0", "0", "3"])
  expect(tableData[5]).toEqual(["TOTAL", "1", "3", "3"])
}

export const checkLiveStatusExceptionsReport = async function (this: Bichard) {
  const tableData = await getRawTableData(this, "#br7_report_data .resultsTable tbody tr")
  const notesField = tableData[2][8].trim().replace(/[\t\n ]/g, "")
  expect(notesField).toMatch(/Errorcodes:1xHO100300,1xHO100304,1xHO100306.*<br><br>Triggercodes:1xTRPR0006.*/)
}

export const checkResolvedExceptionsReport = function () {
  const csv = fs.readFileSync("./tmp/ResolvedExceptions.csv", "utf8")
  const data = parse(csv, {
    columns: false,
    skip_empty_lines: true,
    from_line: 3
  })
  const notesField = data[1][10]
  expect(notesField).toMatch(
    /Trigger codes: 1 x TRPR0006.*\n\nError codes: 1 x HO100300, 1 x HO100304, 1 x HO100306.*\n\nsupervisor: Portal Action: Record Manually Resolved. Reason: Updated disposal\(s\) manually on PNC.*\n\nsupervisor: Portal Action: Trigger Resolved. Code: TRPR0006/
  )
}
