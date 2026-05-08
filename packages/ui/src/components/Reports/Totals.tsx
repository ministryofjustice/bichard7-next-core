import React from "react"
import type { TotalColumnConfig } from "types/reports/Config"

interface TotalsProps {
  totalsConfig?: TotalColumnConfig[]
  totals?: Record<string, unknown>
}

export const Totals: React.FC<TotalsProps> = ({ totalsConfig, totals }) => {
  if (!totalsConfig || !totals) {
    return null
  }

  return (
    <>
      {totalsConfig.map(({ key, label }) => {
        const value = totals[key]

        return (
          <span className="govuk-body govuk-!-margin-left-3 govuk-!-margin-right-3" key={key}>
            <strong>
              {label}
              {":"}
            </strong>{" "}
            {value !== undefined ? String(value) : "0"}
          </span>
        )
      })}
    </>
  )
}
