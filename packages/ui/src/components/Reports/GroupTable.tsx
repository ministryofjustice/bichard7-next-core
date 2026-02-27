import React from "react"
import { ReportConfig } from "types/reports/Config"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { isRecord } from "services/reports/utils/isRecord"
import { ReportTableHeader } from "./ReportTableHeader"
import { ReportTableBody } from "./ReportTableBody"
import { Table } from "components/Table"
import { ReportContainer } from "./GroupTable.styles"

interface GroupedTableProps<T> {
  config: ReportConfig
  groups: T[]
}

const ensureString = (val: unknown): string => {
  if (typeof val === "string") {
    return val
  }

  if (typeof val === "number") {
    return String(val)
  }

  return ""
}

export const GroupTable = <T extends Record<string, unknown>>({ config, groups }: GroupedTableProps<T>) => {
  if (!config.isGrouped) {
    return
  }

  const renderableGroups = groups.map((group) => {
    const groupName = ensureString(group[config.groupNameKey])
    const rawDataList = group[config.dataListKey]

    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    return {
      groupName,
      rows: cleanRows
    }
  })

  return (
    <ReportContainer className="report-container">
      {renderableGroups.map(({ groupName, rows }) => {
        const sectionId = `report-group-${groupName}`

        return (
          <section key={sectionId} aria-labelledby={sectionId}>
            <h3 id={sectionId} className={"govuk-heading-m"}>
              {groupName}
            </h3>

            <Table>
              <caption className="govuk-visually-hidden">{`Report table for ${groupName}`}</caption>

              <ReportTableHeader columns={config.columns} />
              <ReportTableBody rows={rows} columns={config.columns} />
            </Table>
          </section>
        )
      })}
    </ReportContainer>
  )
}
