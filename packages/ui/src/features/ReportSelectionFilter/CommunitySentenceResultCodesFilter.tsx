import { FormGroup } from "@/components/FormGroup"
import CollapsibleCheckboxGroup from "@/components/SearchFilters/CollapsibleCheckboxGroup"
import { TRPR0031_RESULTS } from "@moj-bichard7/common/utils/triggerConstants"

interface CommunitySentenceResultCodesFilterProps {
  onChange: (selectedResultCodes: string[]) => void
  error?: string | null
  selectedResultCodes: string[]
}

export const CommunitySentenceResultCodesFilter: React.FC<CommunitySentenceResultCodesFilterProps> = ({
  onChange,
  error,
  selectedResultCodes
}) => {
  return (
    <>
      <h2 className="govuk-heading-m">{"Result codes"}</h2>
      <FormGroup showError={!!error}>
        {error && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span>
            {error}
          </p>
        )}
        <CollapsibleCheckboxGroup
          onChange={onChange}
          allCheckboxLabel="result codes"
          allOptions={TRPR0031_RESULTS}
          selected={selectedResultCodes}
        />
      </FormGroup>
    </>
  )
}
