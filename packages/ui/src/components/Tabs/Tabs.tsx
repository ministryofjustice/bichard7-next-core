import type { ComponentProps } from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { StyledTabs } from "./Tabs.styles"
import { mergeClassNames } from "../../helpers/mergeClassNames"

const TabsContext = createContext<{
  activeTab: string | null
  setActiveTab: (tab: string) => void
}>({
  activeTab: null,
  setActiveTab: (_: string) => {}
})

export const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Component must be used within a Tabs component")
  }
  return context
}

export interface TabsProps extends ComponentProps<"div"> {
  defaultValue: string
  onTabChanged?: (tab: string) => void
}

export function Tabs({ defaultValue, className, children, onTabChanged }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleSetActiveTab = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      if (onTabChanged) {
        onTabChanged(tab)
      }
    },
    [onTabChanged]
  )

  const tabsContextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab: handleSetActiveTab
    }),
    [activeTab, handleSetActiveTab]
  )

  return (
    <TabsContext value={tabsContextValue}>
      <StyledTabs className={mergeClassNames("govuk-tabs", className)}>{children}</StyledTabs>
    </TabsContext>
  )
}
