import { AuditDto } from "@moj-bichard7/common/types/Audit"
import React from "react"
import { format } from "date-fns"

interface Props {
  audit: AuditDto
}

const DATE_FORMAT = "d MMM y"

const AuditCaseListSummary: React.FC<Props> = ({ audit }) => {
  const { fromDate, toDate } = audit

  const dateRangeText = `${format(new Date(fromDate), DATE_FORMAT)} to ${format(new Date(toDate), DATE_FORMAT)}`

  const volumeText = `${audit.volumeOfCases}% of cases`

  const usersCount = audit.resolvedByUsers.length
  const userText = `from ${usersCount} user${usersCount === 1 ? "" : "s"}`

  const triggerCount = audit.triggerTypes?.length ?? 0
  const hasExceptions = audit.includedTypes.includes("Exceptions")

  const conditions = []
  if (triggerCount > 0) {
    conditions.push(`${audit.triggerTypes?.length} Trigger${triggerCount === 1 ? "" : "s"}`)
  }
  if (hasExceptions) {
    conditions.push(`Exceptions`)
  }

  const withText = conditions.length > 0 ? ` with ${conditions.join(" and ")}` : ""

  return <h2 className="govuk-body">{`${dateRangeText}: showing ${volumeText} ${userText}${withText}`}</h2>
}

export default AuditCaseListSummary
