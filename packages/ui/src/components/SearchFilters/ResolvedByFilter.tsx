import { Details } from "@/features/AuditSearch/AuditSearch.styles"
import AuditResolvedBy from "@/types/AuditResolvedBy"
import { formatUserFullName } from "@/utils/formatUserFullName"
import Checkbox from "../Checkbox/Checkbox"

interface ResolveByFilterProps {
  allResolversSelected: boolean
  resolvedByRefs: React.RefObject<HTMLInputElement[]>
  deletedResolvedByRefs: React.RefObject<HTMLInputElement[]>
  setAllResolversSelected: React.Dispatch<React.SetStateAction<boolean>>
  activeResolvers: AuditResolvedBy[]
  deletedResolvers: AuditResolvedBy[]
  resolvedBy: string[]
}

function ResolveByFilter({
  allResolversSelected,
  resolvedByRefs,
  setAllResolversSelected,
  activeResolvers,
  resolvedBy,
  deletedResolvers,
  deletedResolvedByRefs
}: ResolveByFilterProps) {
  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <Checkbox
        checked={allResolversSelected}
        label={"All active users"}
        data-testid={"audit-resolved-by-all"}
        onChange={(e) => {
          resolvedByRefs.current.forEach((input) => ((input as HTMLInputElement).checked = e.target.checked))
          setAllResolversSelected(e.target.checked)
        }}
      />
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
          }}
          ref={(elem) => {
            if (elem) {
              resolvedByRefs.current[index] = elem
            }
          }}
        />
      ))}
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
