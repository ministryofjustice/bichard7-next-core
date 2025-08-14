import type { ComponentProps } from "react"
import { mergeClassNames } from "../../helpers/mergeClassNames"
import { useTabsContext } from "./Tabs"

export interface TabPanelProps extends ComponentProps<"section"> {
  value: string
}

export function TabPanel({ value, className, children }: TabPanelProps) {
  const { activeTab } = useTabsContext()
  const isActive = activeTab == value

  return (
    <section
      id={`${value}-panel`}
      className={mergeClassNames("govuk-tabs__panel", isActive ? "" : "govuk-tabs__panel--hidden", className)}
      role="tabpanel"
    >
      {children}
    </section>
  )
}
