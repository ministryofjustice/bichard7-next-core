import { formatUserFullName } from "@/utils/formatUserFullName"
import Checkbox from "../Checkbox/Checkbox"
import Details from "./Details"
import AuditResolvedBy from "@/types/AuditResolvedBy"

interface ResolverDetailsProps {
  summary: string
  detailsId: string
  resolvers: AuditResolvedBy[]
  refs: React.RefObject<HTMLInputElement[]>
  resolvedBy: string[]
  keyPrefix?: string
  idPrefix: string
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ResolverDetails = ({
  summary,
  detailsId,
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
    <Details summary={summary} id={detailsId}>
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

export default ResolverDetails
