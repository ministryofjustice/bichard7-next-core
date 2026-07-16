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
      <Details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{"Show active users"}</span>
        </summary>
        <div className="govuk-details__text">
          {activeResolvers.map((resolver, index) => (
            <Checkbox
              key={`${resolver.username}-${index}`}
              id={`resolvers${index}`}
              name="resolvedBy"
              value={resolver.username}
              defaultChecked={resolvedBy.includes(resolver.username)}
              label={formatUserFullName(resolver.forenames, resolver.surname)}
              data-testid={`audit-resolved-by-${index}`}
              onChange={(_) => {
                setAllResolversSelected(resolvedByRefs.current.every((input) => (input as HTMLInputElement).checked))
                pushUpdates()
              }}
              ref={(elem) => {
                if (elem) {
                  resolvedByRefs.current[index] = elem
                }
              }}
            />
          ))}
        </div>
      </Details>
      {deletedResolvers.length > 0 && (
        <Details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">{"Show deleted users"}</span>
          </summary>
          <div className="govuk-details__text">
            {deletedResolvers.map((resolver, index) => {
              return (
                <Checkbox
                  key={`deleted-${resolver.username}`}
                  id={`deleted-resolvers-${index}`}
                  name="resolvedBy"
                  value={resolver.username}
                  defaultChecked={resolvedBy.includes(resolver.username)}
                  label={formatUserFullName(resolver.forenames, resolver.surname)}
                  data-testid={`audit-resolved-by-deleted-${index}`}
                  ref={(elem) => {
                    if (elem) {
                      deletedResolvedByRefs.current[index] = elem
                    }
                  }}
                  onChange={(_) => {
                    pushUpdates()
                  }}
                />
              )
            })}
          </div>
        </Details>
      )}
    </div>
  )
}

export default ResolveByFilter
