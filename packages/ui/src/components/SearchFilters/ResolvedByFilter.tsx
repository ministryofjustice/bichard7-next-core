import AuditResolvedBy from "@/types/AuditResolvedBy"
import { formatUserFullName } from "@/utils/formatUserFullName"
import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"
import Details from "../Details/Details"

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

interface ResolverDetailsProps {
  summary: string
  resolvers: AuditResolvedBy[]
  refs: React.RefObject<HTMLInputElement[]>
  resolvedBy: string[]
  keyPrefix?: string
  idPrefix: string
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ResolverDetails = ({
  summary,
  resolvers,
  refs,
  resolvedBy,
  keyPrefix = "",
  idPrefix,
  onCheckboxChange
}: ResolverDetailsProps) => {
  if (!resolvers || resolvers.length === 0) {
    return null
  }
  return (
    <Details summary={summary}>
      {resolvers.map((resolver, index) => (
        <Checkbox
          key={`${keyPrefix}${resolver.username}-${index}`}
          id={`${idPrefix}${index}`}
          name="resolvedBy"
          value={resolver.username}
          defaultChecked={resolvedBy.includes(resolver.username)}
          label={formatUserFullName(resolver.forenames, resolver.surname)}
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

export default ResolveByFilter
