import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

import { LabelText } from "govuk-react"

interface Props {
  dispatch: Dispatch<FilterAction>
  id: "courtName" | "defendantName" | "ptiurn" | "reasonCodes"
  label: string
  value?: string
}

const TextFilter: React.FC<Props> = ({ dispatch, id, label, value }: Props) => {
  return (
    <label className="govuk-label govuk-label--s" htmlFor={id}>
      <LabelText>{label}</LabelText>
      <div className="govuk-input__wrapper">
        <div aria-hidden="true" className="govuk-input__prefix">
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              clipRule="evenodd"
              d="M9.6999 10.6C12.0747 10.6 13.9999 8.67482 13.9999 6.3C13.9999 3.92518 12.0747 2 9.6999 2C7.32508 2 5.3999 3.92518 5.3999 6.3C5.3999 8.67482 7.32508 10.6 9.6999 10.6ZM9.6999 12.6C13.1793 12.6 15.9999 9.77939 15.9999 6.3C15.9999 2.82061 13.1793 0 9.6999 0C6.22051 0 3.3999 2.82061 3.3999 6.3C3.3999 9.77939 6.22051 12.6 9.6999 12.6Z"
              fill="#0B0C0C"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d="M6.70706 10.7071L1.70706 15.7071L0.292847 14.2929L5.29285 9.29289L6.70706 10.7071Z"
              fill="#0B0C0C"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <input
          className="govuk-input"
          id={id}
          name={id}
          onChange={(event) => {
            dispatch({ method: "add", type: id, value: event.currentTarget.value })
          }}
          type="text"
          value={value}
        />
      </div>
    </label>
  )
}

export default TextFilter
