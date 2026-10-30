import AuditResolvedBy from "@/types/AuditResolvedBy"
import { formatUserFullName } from "@/utils/formatUserFullName"
import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import CheckboxesDetails, { CheckboxDetails } from "../Details/CheckboxesDetails"

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

  const activeResolvers: CheckboxDetails[] = []
  const deletedResolvers: CheckboxDetails[] = []

  for (const resolver of resolvers) {
    const checkboxDetail = { id: resolver.username, label: formatUserFullName(resolver.forenames, resolver.surname) }
    if (resolver.deleted) {
      deletedResolvers.push(checkboxDetail)
    } else {
      activeResolvers.push(checkboxDetail)
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
      <CheckboxesDetails
        summary="Show active users"
        detailsId="active-users"
        allOptions={activeResolvers}
        refs={resolvedByRefs}
        selected={resolvedBy}
        idPrefix="resolvers"
        onCheckboxChange={(_) => {
          setAllResolversSelected(resolvedByRefs.current.every((input) => (input as HTMLInputElement).checked))
          pushUpdates()
        }}
      />

      {deletedResolvers.length > 0 && (
        <CheckboxesDetails
          summary="Show deleted users"
          detailsId="deleted-users"
          allOptions={deletedResolvers}
          refs={deletedResolvedByRefs}
          selected={resolvedBy}
          keyPrefix="deleted-"
          idPrefix="deleted-resolvers-"
          onCheckboxChange={(_) => {
            pushUpdates()
          }}
        />
      )}
    </div>
  )
}

export default ResolveByFilter
