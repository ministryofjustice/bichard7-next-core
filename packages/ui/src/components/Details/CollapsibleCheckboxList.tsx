import Checkbox from "../Checkbox/Checkbox"
import Details from "./Details"

export interface CheckboxOption {
  id: string
  label: string
}

interface CollapsibleCheckboxListProps {
  summary: string
  detailsId: string
  allOptions: CheckboxOption[]
  refs: React.RefObject<HTMLInputElement[]>
  selected: string[]
  keyPrefix?: string
  idPrefix: string
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
}

const CollapsibleCheckboxList = ({
  summary,
  detailsId,
  allOptions,
  refs,
  selected,
  keyPrefix = "",
  idPrefix,
  onCheckboxChange,
  name
}: CollapsibleCheckboxListProps) => {
  if (!allOptions || allOptions.length === 0) {
    return null
  }
  return (
    <Details summary={summary} id={detailsId}>
      {allOptions.map((option, index) => (
        <Checkbox
          key={`${keyPrefix}${option.id}-${index}`}
          id={`${idPrefix}${index}`}
          name={name}
          value={option.id}
          defaultChecked={selected.includes(option.id)}
          label={option.label}
          data-testid={`${keyPrefix}${index}`}
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

export default CollapsibleCheckboxList
