import AuditResolvedBy from "@/types/AuditResolvedBy"
import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import ResolverDetails from "../Details/ResolverDetails"

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

  const activeResolvers: AuditResolvedBy[] = []
  const deletedResolvers: AuditResolvedBy[] = []

  for (const resolver of resolvers) {
    if (resolver.deleted) {
      deletedResolvers.push(resolver)
    } else {
      activeResolvers.push(resolver)
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
      <ResolverDetails
        summary="Show active users"
        detailsId="active-users"
        resolvers={activeResolvers}
        refs={resolvedByRefs}
        resolvedBy={resolvedBy}
        idPrefix="resolvers"
        onCheckboxChange={(_) => {
          setAllResolversSelected(resolvedByRefs.current.every((input) => (input as HTMLInputElement).checked))
          pushUpdates()
        }}
      />

      {deletedResolvers.length > 0 && (
        <ResolverDetails
          summary="Show deleted users"
          detailsId="deleted-users"
          resolvers={deletedResolvers}
          refs={deletedResolvedByRefs}
          resolvedBy={resolvedBy}
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
