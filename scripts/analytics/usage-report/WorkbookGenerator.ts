import { ReportData, ReportDataResult, reportEventTitles } from "./common"

const excel = require("excel4node")

export default class WorkbookGenerator {
  private workbook
  private mainCellStyle
  constructor(
    private reportDataResult: ReportDataResult,
    private usersWithAccessToNewUi: string[]
  ) {
    this.workbook = new excel.Workbook()
    this.mainCellStyle = this.workbook.createStyle({
      font: {
        size: 12,
        bold: true
      }
    })
  }

  private getEventTitle = (eventCode: string) => {
    const eventTitlePrefix =
      eventCode.split(".")[0] === "new-ui" ? "New: " : eventCode.split(".")[0] === "old-ui" ? "Old: " : ""
    const actualEventCode = eventCode.split(".").slice(1).join(".")
    const eventTitle = reportEventTitles[actualEventCode] ?? actualEventCode

    return `${eventTitlePrefix}${eventTitle}`
  }

  public generate = () => {
    this.generateMonthlyStats(this.reportDataResult)

    this.generateDailyReport(this.reportDataResult.allEvents, "All")
    this.generateMonthlyReport(this.reportDataResult.allEvents, "All")
    this.generateUserReport(this.reportDataResult.allEvents, "All")
    this.generateDailyUserReport(this.reportDataResult.allEvents, "All")
    this.generateMonthlyUserReport(this.reportDataResult.allEvents, "All")
    this.generateMonthlyForceReport(this.reportDataResult.allEvents, "All")

    return this
  }

  public saveToFile = (filename: string) => this.workbook.write(filename)

  private generateDailyReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Daily (${title})`)
    this.addHeaderRow(sheet, reportData, "Date")

    Object.entries(reportData.daily).forEach(([date, data], rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .string(date)
        .style(this.mainCellStyle)
      reportData.eventCodes.forEach((eventCode, columnIndex) => {
        sheet.cell(rowIndex + 2, columnIndex + 2).number(data[eventCode] || 0)
      })
    })

    this.addFooterRow(sheet, reportData, Object.keys(reportData.daily).length)
  }

  private generateMonthlyReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Monthly (${title})`)
    this.addHeaderRow(sheet, reportData, "Date")

    Object.entries(reportData.monthly).forEach(([date, data], rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .string(date)
        .style(this.mainCellStyle)
      reportData.eventCodes.forEach((eventCode, columnIndex) => {
        sheet.cell(rowIndex + 2, columnIndex + 2).number(data[eventCode] || 0)
      })
    })

    this.addFooterRow(sheet, reportData, Object.keys(reportData.monthly).length)
  }

  private generateUserReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Users (${title})`)
    this.addHeaderRow(sheet, reportData, "User")

    Object.entries(reportData.users).forEach(([username, data], rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .string(username)
        .style(this.mainCellStyle)
      reportData.eventCodes.forEach((eventCode, columnIndex) => {
        sheet.cell(rowIndex + 2, columnIndex + 2).number(data[eventCode] || 0)
      })
    })

    this.addFooterRow(sheet, reportData, Object.keys(reportData.users).length)
  }

  private generateDailyUserReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Users Daily (${title})`)
    this.addHeaderRow(sheet, reportData, "Date", "User")

    let rowIndex = 2
    Object.entries(reportData.dailyUsers).forEach(([date, userData]) => {
      Object.entries(userData).forEach(([username, data]) => {
        sheet.cell(rowIndex, 1).string(date).style(this.mainCellStyle)
        sheet.cell(rowIndex, 2).string(username).style(this.mainCellStyle)
        reportData.eventCodes.forEach((eventCode, columnIndex) => {
          sheet.cell(rowIndex, columnIndex + 3).number(data[eventCode] || 0)
        })

        rowIndex += 1
      })
    })

    this.addFooterRow(sheet, reportData, rowIndex - 2, true)
  }

  private generateMonthlyUserReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Users Monthly (${title})`)
    this.addHeaderRow(sheet, reportData, "Date", "User")

    let rowIndex = 2
    Object.entries(reportData.monthlyUsers).forEach(([date, userData]) => {
      Object.entries(userData).forEach(([username, data]) => {
        sheet.cell(rowIndex, 1).string(date).style(this.mainCellStyle)
        sheet.cell(rowIndex, 2).string(username).style(this.mainCellStyle)
        reportData.eventCodes.forEach((eventCode, columnIndex) => {
          sheet.cell(rowIndex, columnIndex + 3).number(data[eventCode] || 0)
        })

        rowIndex += 1
      })
    })

    this.addFooterRow(sheet, reportData, rowIndex - 2, true)
  }

  private generateMonthlyForceReport = (reportData: ReportData, title: string) => {
    const sheet = this.workbook.addWorksheet(`Forces Monthly (${title})`)
    this.addHeaderRow(sheet, reportData, "Date", "Force")

    let rowIndex = 2
    Object.entries(reportData.monthlyForces).forEach(([date, forceData]) => {
      Object.entries(forceData).forEach(([force, data]) => {
        sheet.cell(rowIndex, 1).string(date).style(this.mainCellStyle)
        sheet.cell(rowIndex, 2).string(force).style(this.mainCellStyle)
        reportData.eventCodes.forEach((eventCode, columnIndex) => {
          sheet.cell(rowIndex, columnIndex + 3).number(data[eventCode] || 0)
        })

        rowIndex += 1
      })
    })

    this.addFooterRow(sheet, reportData, rowIndex - 2, true)
  }

  private addHeaderRow = (sheet, reportData: ReportData, firstColumnName: string, secondColumnName?: string) => {
    sheet.cell(1, 1).string(firstColumnName).style(this.mainCellStyle)
    if (secondColumnName) {
      sheet.cell(1, 2).string(secondColumnName).style(this.mainCellStyle)
    }

    const startColumnIndex = 2 + (secondColumnName ? 1 : 0)
    reportData.eventCodes.forEach((eventCode, index) => {
      // REVIEW AND REMOVE
      // const eventTitle =
      //   (eventCode.split(".")[0] === "new-ui" ? "New UI " : eventCode.split(".")[0] === "old-ui" ? "Old UI " : "") +
      //   eventCode.split(".").slice(1).join()
      sheet
        .cell(1, startColumnIndex + index)
        .string(this.getEventTitle(eventCode))
        .style(this.mainCellStyle)
    })
  }

  private addFooterRow = (sheet, reportData: ReportData, totalReportDataRows: number, hasSecondColumn = false) => {
    const footerRowIndex = totalReportDataRows + 2
    sheet.cell(footerRowIndex, 1).string("Total").style(this.mainCellStyle)

    const startColumnIndex = hasSecondColumn ? 3 : 2
    reportData.eventCodes.forEach((_, index) => {
      const columnName = String.fromCharCode(66 + index + (startColumnIndex - 2))
      sheet
        .cell(footerRowIndex, startColumnIndex + index)
        .formula(`SUM(${columnName}1:${columnName}${footerRowIndex - 1})`)
    })
  }

  private generateMonthlyStats(reportDataResult: ReportDataResult) {
    const sheet = this.workbook.addWorksheet(`Monthly stats`)
    let rowIndex = 1

    // XX People have the new UI turned on
    sheet.cell(rowIndex++, 1).string(`${this.usersWithAccessToNewUi.length} People have the new UI turned on`)

    Object.entries(reportDataResult.allEvents.monthly).forEach(([date, monthlyData]) => {
      sheet.cell(rowIndex++, 1).string(date).style(this.mainCellStyle)
      const monthlyUsersData = reportDataResult.allEvents.monthlyUsers[date]

      // XX People resolved a trigger on the new UI
      const totalUsersResolvedTriggersInNewUi = Object.entries(monthlyUsersData).filter(
        ([_, monthlyUserData]) => (monthlyUserData["new-ui.triggers.resolved"] || 0) > 0
      ).length
      sheet.cell(rowIndex++, 1).string(`${totalUsersResolvedTriggersInNewUi} People resolved a trigger on the new UI`)

      // XX People resolved an exception on the new UI
      const totalUsersResolvedExceptionsInNewUi = Object.entries(monthlyUsersData).filter(
        ([_, monthlyUserData]) => (monthlyUserData["new-ui.exceptions.resolved"] || 0) > 0
      ).length
      sheet
        .cell(rowIndex++, 1)
        .string(`${totalUsersResolvedExceptionsInNewUi} People resolved an exception on the new UI`)

      // Of XX people who have the UI turned on, XX.XX% of their triggers were resolved in the new UI
      const oldUiTriggersResolved = monthlyData["old-ui.triggers.resolved"] || 0
      const newUiTriggersResolved = monthlyData["new-ui.triggers.resolved"] || 0
      const totalTriggersResolved = oldUiTriggersResolved + newUiTriggersResolved
      // prettier-ignore
      const triggersResolvedInNewUiPercentage = (totalTriggersResolved ? newUiTriggersResolved / totalTriggersResolved * 100 : 0 ).toFixed(2)
      sheet
        .cell(rowIndex++, 1)
        .string(
          `Of ${this.usersWithAccessToNewUi.length} people who have the UI turned on, ${triggersResolvedInNewUiPercentage}% of their triggers were resolved in the new UI`
        )

      // Of XX people who have the UI turned on, XX.XX% of their exceptions were resolved in the new UI
      const oldUiExceptionResolved = monthlyData["old-ui.exceptions.resolved"] || 0
      const newUiExceptionResolved = monthlyData["new-ui.exceptions.resolved"] || 0
      const totalExceptionsResolved = oldUiExceptionResolved + newUiExceptionResolved
      // prettier-ignore
      const exceptionsResolvedInNewUiPercentage = (totalExceptionsResolved ? newUiExceptionResolved / totalExceptionsResolved * 100 : 0).toFixed(2)
      sheet
        .cell(rowIndex++, 1)
        .string(
          `Of ${this.usersWithAccessToNewUi.length} people who have the UI turned on, ${exceptionsResolvedInNewUiPercentage}% of their exceptions were resolved in the new UI`
        )

      rowIndex++
    })
  }
}
