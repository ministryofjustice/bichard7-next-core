import { StyledTabHeaders } from "./TabHeaders.styles"
import { ComponentProps, JSX, KeyboardEvent, SyntheticEvent } from "react"
import { mergeClassNames } from "../../helpers/mergeClassNames"
import { useTabsContext } from "./Tabs"

export function TabHeaders({ className, children }: ComponentProps<"ul">): JSX.Element {
  return (
    <StyledTabHeaders className={mergeClassNames("govuk-tabs__list tab-list", className)} role="tablist">
      {children}
    </StyledTabHeaders>
  )
}

export interface TabHeadersProps extends ComponentProps<"li"> {
  value: string
}

export function TabHeader({ value, className, children }: TabHeadersProps): JSX.Element {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab == value

  const handleTabClicked = (event: SyntheticEvent, tab: string) => {
    event.preventDefault()
    setActiveTab(tab)
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    const focusedTab = e.target as HTMLAnchorElement

    if (e.key === "ArrowRight") {
      const nextTab = focusedTab.parentElement?.nextElementSibling?.firstElementChild as HTMLAnchorElement | null
      if (nextTab) {
        nextTab.click()
        nextTab.focus()
      }
    } else if (e.key === "ArrowLeft") {
      const prevTab = focusedTab.parentElement?.previousElementSibling?.firstElementChild as HTMLAnchorElement | null
      if (prevTab) {
        prevTab.click()
        prevTab.focus()
      }
    }
  }

  return (
    <li
      className={mergeClassNames(
        "tab govuk-tabs__list-item",
        isActive ? "govuk-tabs__list-item--selected" : "",
        className
      )}
      role="presentation"
    >
      <a
        id={`${value}-tab`}
        className="govuk-tabs__tab"
        href={`#${value}`}
        onClick={(e) => handleTabClicked(e, value)}
        role="tab"
        aria-controls={value}
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onKeyDown={(e) => handleOnKeyDown(e)}
      >
        {children}
      </a>
    </li>
  )
}
