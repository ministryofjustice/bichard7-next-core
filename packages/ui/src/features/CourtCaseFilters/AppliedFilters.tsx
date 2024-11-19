import ConditionalRender from "components/ConditionalRender"
import FilterTag from "components/FilterTag/FilterTag"
import { useCurrentUser } from "context/CurrentUserContext"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { LockedState, Reason, SerializedDateRange } from "types/CaseListQueryParams"
import { caseStateLabels } from "utils/caseStateFilters"
import { formatStringDateAsDisplayedDate } from "utils/date/formattedDate"
import { deleteQueryParam, deleteQueryParamsByName } from "utils/deleteQueryParam"

interface Props {
  filters: {
    caseAge?: string[]
    caseResolvedDateRange?: null | SerializedDateRange
    caseState?: null | string
    courtName?: null | string
    dateRange?: null | SerializedDateRange
    defendantName?: null | string
    lockedState?: null | string
    ptiurn?: null | string
    reason?: null | Reason
    reasonCodes?: string[]
    resolvedByUsername?: null | string
  }
}

const AppliedFilters: React.FC<Props> = ({ filters }: Props) => {
  const { basePath, query } = useRouter()
  const currentUser = useCurrentUser()
  const hasAnyAppliedFilters = (): boolean =>
    (!!filters.reason && filters.reason !== Reason.All) ||
    !!filters.defendantName ||
    (filters.caseAge && filters.caseAge.length > 0) ||
    !!filters.courtName ||
    !!filters.reasonCodes?.length ||
    !!filters.ptiurn ||
    !!filters.dateRange?.from ||
    !!filters.dateRange?.to ||
    (!!filters.lockedState && filters.lockedState !== LockedState.All) ||
    !!filters.caseState ||
    !!filters.caseResolvedDateRange?.from ||
    !!filters.caseResolvedDateRange?.to ||
    !!filters.resolvedByUsername

  const removeFilterFromPath = (paramToRemove: { [key: string]: string }): string => {
    let searchParams = deleteQueryParam(paramToRemove, query)
    searchParams = deleteQueryParamsByName(["pageNum"], searchParams)

    return `${basePath}/?${searchParams}`
  }

  const removeQueryParamsByName = (paramsToRemove: string[]): string => {
    let searchParams = new URLSearchParams(encode(query))
    searchParams = deleteQueryParamsByName(paramsToRemove, searchParams)
    return `${basePath}/?${searchParams}`
  }

  const removeQueryFromArray = (key: string, value: string) => {
    const searchParams = new URLSearchParams(encode(query))
    const array = searchParams.get(key)

    if (array) {
      const newArray = array
        .split(" ")
        .filter((param) => param !== value)
        .join(" ")

      searchParams.set(key, newArray)
    }
    return `${basePath}/?${searchParams}`
  }

  return (
    <div>
      <ConditionalRender isRendered={hasAnyAppliedFilters()}>
        <ul className="moj-filter-tags" key={"applied-filters"}>
          <li>
            <p className="govuk-heading-s govuk-!-margin-bottom-0">{"Filters applied:"}</p>
          </li>

          <ConditionalRender isRendered={!!filters.reason && filters.reason !== Reason.All}>
            <li key={`${filters.reason}`}>
              <FilterTag href={removeFilterFromPath({ reason: filters.reason ?? "" })} tag={filters.reason ?? ""} />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.defendantName}>
            <li key={`${filters.defendantName}`}>
              <FilterTag
                href={removeFilterFromPath({ defendantName: filters.defendantName ?? "" })}
                tag={filters.defendantName ?? ""}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.courtName}>
            <li>
              <FilterTag
                href={removeFilterFromPath({ courtName: filters.courtName ?? "" })}
                tag={filters.courtName ?? ""}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.reasonCodes}>
            {filters.reasonCodes?.map((reasonCode) => (
              <li key={`applied-filter-${reasonCode}`}>
                <FilterTag href={removeQueryFromArray("reasonCodes", reasonCode)} tag={reasonCode} />
              </li>
            ))}
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.ptiurn}>
            <li>
              <FilterTag href={removeFilterFromPath({ ptiurn: filters.ptiurn ?? "" })} tag={filters.ptiurn ?? ""} />
            </li>
          </ConditionalRender>

          {filters.caseAge &&
            filters.caseAge.map((slaDate) => {
              return (
                <li key={`${slaDate}`}>
                  <FilterTag href={removeFilterFromPath({ caseAge: slaDate })} tag={slaDate} />
                </li>
              )
            })}

          <ConditionalRender isRendered={!!filters.dateRange?.from && !!filters.dateRange.to}>
            <li>
              <FilterTag
                href={removeQueryParamsByName(["from", "to", "pageNum"])}
                tag={`${formatStringDateAsDisplayedDate(filters.dateRange?.from)} - ${formatStringDateAsDisplayedDate(
                  filters.dateRange?.to
                )}`}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.caseResolvedDateRange?.from && !!filters.caseResolvedDateRange.to}>
            <li>
              <FilterTag
                href={removeQueryParamsByName(["resolvedFrom", "resolvedTo", "pageNum"])}
                tag={`${formatStringDateAsDisplayedDate(filters.caseResolvedDateRange?.from)} - ${formatStringDateAsDisplayedDate(
                  filters.caseResolvedDateRange?.to
                )}`}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.lockedState && filters.lockedState !== LockedState.All}>
            <li>
              <FilterTag
                href={removeFilterFromPath({ lockedState: filters.lockedState ?? LockedState.All })}
                tag={filters.lockedState ?? ""}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.caseState}>
            <li>
              <FilterTag
                href={removeFilterFromPath({ state: filters.caseState ?? "" })}
                tag={caseStateLabels[String(filters.caseState)] ?? ""}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={filters.resolvedByUsername === currentUser.username}>
            <li>
              <FilterTag href={removeQueryParamsByName(["resolvedByUsername"])} tag={"My resolved cases"} />
            </li>
          </ConditionalRender>

          <li>
            <p className="moj-filter__heading-action" id="clear-filters-applied">
              <a className="govuk-link govuk-link--no-visited-state" href="/bichard?keywords=">
                {"Clear filters"}
              </a>
            </p>
          </li>
        </ul>
      </ConditionalRender>
    </div>
  )
}

export default AppliedFilters
