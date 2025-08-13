import { createContext, type PropsWithChildren, useContext, useState } from "react"

const TabsContext = createContext<{
  activeTab: string | null
  setActiveTab: (tab: string) => void
}>({
  activeTab: null,
  setActiveTab: (_: string) => {}
})

export const useTabsContext = () => useContext(TabsContext)

export interface TabsProps extends PropsWithChildren {
  defaultValue: string
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className="govuk-tabs">
      <TabsContext
        value={{
          activeTab,
          setActiveTab: (tab) => setActiveTab(tab)
        }}
      >
        {children}
      </TabsContext>
    </div>
  )
}
