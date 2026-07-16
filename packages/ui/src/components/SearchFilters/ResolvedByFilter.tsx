import { Details } from "@/features/AuditSearch/AuditSearch.styles"
import AuditResolvedBy from "@/types/AuditResolvedBy"
import { formatUserFullName } from "@/utils/formatUserFullName"
import { useRef, useState } from "react"
import Checkbox from "../Checkbox/Checkbox"

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

  interface ResolverDetailsProps {
    summary: string
    resolvers: AuditResolvedBy[]
    refs: React.RefObject<HTMLInputElement[]>
    getKey: (resolver: AuditResolvedBy[], index: number) => string
    getId: (index: number) => string
    getTestId: (index: number) => string
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }

  const ResolverDetails = ({
    summary,
    resolvers,
    refs,
    getKey,
    getId,
    getTestId,
    onCheckboxChange
  }: ResolverDetailsProps) => {
    if (!resolvers || resolvers.length === 0) {
      return null
    }
    return (
      <Details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{summary}</span>
        </summary>
        <div className="govuk-details__text">
          {resolvers.map((resolver, index) => (
            <Checkbox
              key={getKey(resolver, index)}
              id={getId(index)}
              name="resolvedBy"
              value={resolver.username}
              defaultChecked={resolvedBy.includes(resolver.username)}
              label={formatUserFullName(resolver.forenames, resolver.surname)}
              data-testid={getTestId(index)}
              onChange={onCheckboxChange}
              ref={(elem) => {
                if (elem) {
                  refs.current[index] = elem
                }
              }}
            />
          ))}
        </div>
      </Details>
    )
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
        getKey={(resolver, index) => `${resolver.username}-${index}`}
        getId={(index) => `resolvers${index}`}
        getTestId={(index) => `audit-resolved-by-${index}`}
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
          getKey={(resolver) => `deleted-${resolver.username}`}
          getId={(index) => `deleted-resolvers-${index}`}
          getTestId={(index) => `audit-resolved-by-deleted-${index}`}
          onCheckboxChange={(_) => {
            pushUpdates()
          }}
        />
      )}
    </div>
  )
}

export default ResolveByFilter
