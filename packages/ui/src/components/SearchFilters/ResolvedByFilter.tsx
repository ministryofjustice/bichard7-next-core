import AuditResolvedBy from "@/types/AuditResolvedBy"
import { formatUserFullName } from "@/utils/formatUserFullName"
import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import CollapsibleCheckboxList, { CheckboxOption } from "../Details/CollapsibleCheckboxList"

interface ResolveByFilterProps {
  resolvedBy: string[]
  resolvers: AuditResolvedBy[]
  onChange?: (selected: string[]) => void
}

function ResolveByFilter({ resolvedBy, resolvers, onChange }: Readonly<ResolveByFilterProps>) {
  const [allResolversSelected, setAllResolversSelected] = useState<boolean>(
    resolvers.every((r) => resolvedBy.includes(r.username))
  )

  const resolvedByRefs = useRef<HTMLInputElement[]>([])
  const deletedResolvedByRefs = useRef<HTMLInputElement[]>([])

  const activeResolvers: CheckboxOption[] = []
  const deletedResolvers: CheckboxOption[] = []

  for (const resolver of resolvers) {
    const checkboxOption = { id: resolver.username, label: formatUserFullName(resolver.forenames, resolver.surname) }
    if (resolver.deleted) {
      deletedResolvers.push(checkboxOption)
    } else {
      activeResolvers.push(checkboxOption)
    }
  }

  const pushUpdates = () => {
    if (!onChange) {
      return
    }

    const activeChecked = resolvedByRefs.current?.filter((input) => input?.checked).map((input) => input.value) || []

    const deletedChecked =
      deletedResolvedByRefs.current?.filter((input) => input?.checked).map((input) => input.value) || []

    onChange([...activeChecked, ...deletedChecked])
  }

  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <Checkbox
        checked={allResolversSelected}
        label={"All active users"}
        data-testid={"audit-resolved-by-all"}
        onChange={(e) => {
          resolvedByRefs.current.forEach((input) => ((input as HTMLInputElement).checked = e.target.checked))
          setAllResolversSelected(e.target.checked)
          pushUpdates()
        }}
      />
      <CollapsibleCheckboxList
        summary="Show active users"
        detailsId="active-users"
        allOptions={activeResolvers}
        refs={resolvedByRefs}
        selected={resolvedBy}
        idPrefix="resolvers"
        keyPrefix="audit-resolved-by-"
        onCheckboxChange={(_) => {
          setAllResolversSelected(resolvedByRefs.current.every((input) => (input as HTMLInputElement).checked))
          pushUpdates()
        }}
        name="resolvedBy"
      />

      {deletedResolvers.length > 0 && (
        <CollapsibleCheckboxList
          summary="Show deleted users"
          detailsId="deleted-users"
          allOptions={deletedResolvers}
          refs={deletedResolvedByRefs}
          selected={resolvedBy}
          keyPrefix="audit-resolved-by-deleted-"
          idPrefix="deleted-resolvers-"
          onCheckboxChange={(_) => {
            pushUpdates()
          }}
          name="resolvedBy"
        />
      )}
    </div>
  )
}

export default ResolveByFilter
