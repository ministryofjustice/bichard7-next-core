import type { ComponentProps } from "react"
import { createContext, useContext, useState } from "react"
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

  return (
    <TabsContext
      value={{
        activeTab,
        setActiveTab: (tab) => {
          setActiveTab(tab)
          if (onTabChanged) {
            onTabChanged(tab)
          }
        }
      }}
    >
      <StyledTabs className={mergeClassNames("govuk-tabs", className)}>{children}</StyledTabs>
    </TabsContext>
  )
}
