import React from "react"
import type { TotalColumnConfig } from "types/reports/Config"
import { TotalsContainer } from "./Totals.styles"

interface TotalsProps {
  totalsConfig: TotalColumnConfig[]
  totals?: Record<string, unknown>
  reportName?: string
  flat?: boolean
}

export const Totals = ({ totalsConfig, totals, reportName, flat = true }: TotalsProps) => {
  if (!totalsConfig || !totals) {
    return null
  }

  return (
    <TotalsContainer className={"govuk-body"} $flat={flat}>
      {reportName ? <strong>{reportName}</strong> : null}

      {totalsConfig.map(({ key, label }) => {
        const value = totals[key]

        return (
          <span className="govuk-body" key={key}>
            <strong>
              {label}
              {":"}
            </strong>{" "}
            {value !== undefined ? String(value) : "0"}
          </span>
        )
      })}
    </TotalsContainer>
  )
}
