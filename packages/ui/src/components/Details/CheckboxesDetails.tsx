import Checkbox from "../Checkbox/Checkbox"
import Details from "./Details"

export interface CheckboxDetails {
  id: string
  label: string
}

interface CheckboxesDetailsProps {
  summary: string
  detailsId: string
  allOptions: CheckboxDetails[]
  refs: React.RefObject<HTMLInputElement[]>
  selected: string[]
  keyPrefix?: string
  idPrefix: string
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckboxesDetails = ({
  summary,
  detailsId,
  allOptions,
  refs,
  selected,
  keyPrefix = "",
  idPrefix,
  onCheckboxChange
}: CheckboxesDetailsProps) => {
  if (!allOptions || allOptions.length === 0) {
    return null
  }
  return (
    <Details summary={summary} id={detailsId}>
      {allOptions.map((option, index) => (
        <Checkbox
          key={`${keyPrefix}${option.id}-${index}`}
          id={`${idPrefix}${index}`}
          name="resolvedBy"
          value={option.id}
          defaultChecked={selected.includes(option.id)}
          label={option.label}
          data-testid={`audit-resolved-by-${keyPrefix}${index}`}
          onChange={onCheckboxChange}
          ref={(elem) => {
            if (elem) {
              refs.current[index] = elem
            }
          }}
        />
      ))}
    </Details>
  )
}

export default CheckboxesDetails
