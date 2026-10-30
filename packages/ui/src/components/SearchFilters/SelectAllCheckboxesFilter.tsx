import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import ResolverDetails, { CheckboxDetails } from "../Details/CheckboxesDetails"

interface ResolveByFilterProps {
  selected: string[]
  allOptions: CheckboxDetails[]
  onChange?: (selected: string[]) => void
  allCheckboxLabel: string
}

function SelectAllCheckboxesFilter({
  selected,
  allOptions,
  onChange,
  allCheckboxLabel
}: Readonly<ResolveByFilterProps>) {
  const [allOptionsSelected, setAllOptionsSelected] = useState<boolean>(
    allOptions.every((r) => selected.includes(r.id))
  )

  const refs = useRef<HTMLInputElement[]>([])

  const pushUpdates = () => {
    if (!onChange) {
      return
    }

    const activeChecked = refs.current?.filter((input) => input?.checked).map((input) => input.value) || []

    onChange(activeChecked)
  }

  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <Checkbox
        checked={allOptionsSelected}
        label={`All ${allCheckboxLabel}`}
        data-testid={"audit-resolved-by-all"}
        onChange={(e) => {
          refs.current.forEach((input) => ((input as HTMLInputElement).checked = e.target.checked))
          setAllOptionsSelected(e.target.checked)
          pushUpdates()
        }}
      />
      <ResolverDetails
        summary={`Show ${allCheckboxLabel}`}
        detailsId="active-users"
        allOptions={allOptions}
        refs={refs}
        selected={selected}
        idPrefix="resolvers"
        onCheckboxChange={(_) => {
          setAllOptionsSelected(refs.current.every((input) => (input as HTMLInputElement).checked))
          pushUpdates()
        }}
      />
    </div>
  )
}

export default SelectAllCheckboxesFilter
