import { useCurrentUser } from "context/CurrentUserContext"
import { Heading } from "govuk-react"
import { useEffect, useState } from "react"

interface Props {
  appliedFilters: React.ReactNode
  courtCaseList: React.ReactNode
  filter: React.ReactNode
  paginationBottom: React.ReactNode
  paginationTop: React.ReactNode
}

const CourtCaseFilterWrapper: React.FC<Props> = ({
  appliedFilters,
  courtCaseList,
  filter,
  paginationBottom,
  paginationTop
}: Props) => {
  const user = useCurrentUser()
  const filterPanelKey = `is-filter-panel-visible-${user.username}`
  const [isSearchPanelShown, setIsSearchPanelShown] = useState(true)

  useEffect(() => {
    const filterPanelValue = localStorage.getItem(filterPanelKey)
    if (filterPanelValue) {
      const storedDate = new Date(filterPanelValue)
      storedDate.setDate(storedDate.getDate() + 7)
      if (storedDate > new Date()) {
        setIsSearchPanelShown(false)
      } else {
        localStorage.removeItem(filterPanelKey)
        setIsSearchPanelShown(true)
      }
    }
  }, [filterPanelKey])

  return (
    <>
      <div className="moj-filter-layout__filter">
        <div className={isSearchPanelShown ? "moj-filter" : "moj-filter moj-hidden"}>{filter}</div>
      </div>
      <Heading as="h1" className="hidden-header" size="LARGE">
        {"Case list"}
      </Heading>
      <div className="moj-filter-layout__content">
        <div className="moj-button-menu">
          <div className="moj-action-bar">
            <button
              aria-expanded={isSearchPanelShown === true}
              aria-haspopup="true"
              className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
              data-module="govuk-button"
              id="filter-button"
              onClick={() => {
                const showSearchPanel = !isSearchPanelShown
                if (!showSearchPanel) {
                  localStorage.setItem(filterPanelKey, new Date().toISOString())
                } else {
                  localStorage.removeItem(filterPanelKey)
                }
                setIsSearchPanelShown(showSearchPanel)
              }}
              type="button"
            >
              {isSearchPanelShown ? "Hide search panel" : "Show search panel"}
            </button>
            {!isSearchPanelShown && <div className="moj-button-menu__wrapper">{appliedFilters}</div>}
          </div>
        </div>

        {paginationTop}

        <div className="moj-scrollable-pane">
          <div className="moj-scrollable-pane__wrapper">{courtCaseList}</div>
        </div>

        {paginationBottom}
      </div>
    </>
  )
}

export default CourtCaseFilterWrapper
