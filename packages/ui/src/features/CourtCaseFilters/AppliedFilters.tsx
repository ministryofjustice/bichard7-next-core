import ConditionalRender from "components/ConditionalRender"
import FilterTag from "components/FilterTag/FilterTag"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { LockedState, Reason, SerializedDateRange } from "types/CaseListQueryParams"
import { caseStateLabels } from "utils/caseStateFilters"
import { deleteQueryParam, deleteQueryParamsByName } from "utils/deleteQueryParam"
import { formatStringDateAsDisplayedDate } from "utils/date/formattedDate"

interface Props {
  filters: {
    reason?: Reason | null
    defendantName?: string | null
    courtName?: string | null
    reasonCodes?: string[]
    ptiurn?: string | null
    caseAge?: string[]
    dateRange?: SerializedDateRange | null
    lockedState?: string | null
    caseState?: string | null
  }
}

const AppliedFilters: React.FC<Props> = ({ filters }: Props) => {
  const { basePath, query } = useRouter()

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
    !!filters.caseState

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
        <ul key={"applied-filters"} className="moj-filter-tags">
          <li>
            <p className="govuk-heading-s govuk-!-margin-bottom-0">{"Filters applied:"}</p>
          </li>

          <ConditionalRender isRendered={!!filters.reason && filters.reason !== Reason.All}>
            <li key={`${filters.reason}`}>
              <FilterTag tag={filters.reason ?? ""} href={removeFilterFromPath({ reason: filters.reason ?? "" })} />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.defendantName}>
            <li key={`${filters.defendantName}`}>
              <FilterTag
                tag={filters.defendantName ?? ""}
                href={removeFilterFromPath({ defendantName: filters.defendantName ?? "" })}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.courtName}>
            <li>
              <FilterTag
                tag={filters.courtName ?? ""}
                href={removeFilterFromPath({ courtName: filters.courtName ?? "" })}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.reasonCodes}>
            {filters.reasonCodes?.map((reasonCode) => (
              <li key={`applied-filter-${reasonCode}`}>
                <FilterTag tag={reasonCode} href={removeQueryFromArray("reasonCodes", reasonCode)} />
              </li>
            ))}
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.ptiurn}>
            <li>
              <FilterTag tag={filters.ptiurn ?? ""} href={removeFilterFromPath({ ptiurn: filters.ptiurn ?? "" })} />
            </li>
          </ConditionalRender>

          {filters.caseAge &&
            filters.caseAge.map((slaDate) => {
              return (
                <li key={`${slaDate}`}>
                  <FilterTag tag={slaDate} href={removeFilterFromPath({ caseAge: slaDate })} />
                </li>
              )
            })}

          <ConditionalRender isRendered={!!filters.dateRange?.from && !!filters.dateRange.to}>
            <li>
              <FilterTag
                tag={`${formatStringDateAsDisplayedDate(filters.dateRange?.from)} - ${formatStringDateAsDisplayedDate(
                  filters.dateRange?.to
                )}`}
                href={removeQueryParamsByName(["from", "to", "pageNum"])}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.lockedState && filters.lockedState !== LockedState.All}>
            <li>
              <FilterTag
                tag={filters.lockedState ?? ""}
                href={removeFilterFromPath({ lockedState: filters.lockedState ?? LockedState.All })}
              />
            </li>
          </ConditionalRender>

          <ConditionalRender isRendered={!!filters.caseState}>
            <li>
              <FilterTag
                tag={caseStateLabels[String(filters.caseState)] ?? ""}
                href={removeFilterFromPath({ state: filters.caseState ?? "" })}
              />
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
