import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import CollapsibleCheckboxList, { CheckboxOption } from "../Details/CollapsibleCheckboxList"

interface CollapsibleCheckboxGroupProps {
  selected: string[]
  allOptions: CheckboxOption[]
  onChange: (selected: string[]) => void
  allCheckboxLabel: string
}

function CollapsibleCheckboxGroup({
  selected,
  allOptions,
  onChange,
  allCheckboxLabel
}: Readonly<CollapsibleCheckboxGroupProps>) {
  const [allOptionsSelected, setAllOptionsSelected] = useState<boolean>(
    allOptions.every((r) => selected.includes(r.id))
  )

  const refs = useRef<HTMLInputElement[]>([])

  const pushUpdates = () => {
    const activeChecked = refs.current?.filter((input) => input?.checked).map((input) => input.value) || []
    onChange(activeChecked)
  }

  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <Checkbox
        checked={allOptionsSelected}
        label={`All ${allCheckboxLabel}`}
        data-testid={"checkbox-all"}
        onChange={(e) => {
          refs.current.forEach((input) => ((input as HTMLInputElement).checked = e.target.checked))
          setAllOptionsSelected(e.target.checked)
          pushUpdates()
        }}
      />
      <CollapsibleCheckboxList
        summary={`Show ${allCheckboxLabel}`}
        detailsId="selected-options"
        allOptions={allOptions}
        refs={refs}
        selected={selected}
        idPrefix="collapsible-checkbox-group-"
        keyPrefix="checkbox-"
        onCheckboxChange={(_) => {
          setAllOptionsSelected(refs.current.every((input) => (input as HTMLInputElement).checked))
          pushUpdates()
        }}
      />
    </div>
  )
}

export default CollapsibleCheckboxGroup
