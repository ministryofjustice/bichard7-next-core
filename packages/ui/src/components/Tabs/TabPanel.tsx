import type { ComponentProps, JSX } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"
import { useTabsContext } from "./Tabs"

export interface TabPanelProps extends ComponentProps<"section"> {
  value: string
}

export const TabPanel = ({ value, className, children }: TabPanelProps): JSX.Element => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab == value

  return (
    <section
      id={`${value}-tab-panel`}
      className={mergeClassNames("govuk-tabs__panel", isActive ? "" : "govuk-tabs__panel--hidden", className)}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
    >
      {children}
    </section>
  )
}
