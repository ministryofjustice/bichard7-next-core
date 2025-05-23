import type { NextRouter } from "next/router"
import type CaseDetailsTab from "types/CaseDetailsTab"

export const updateTabLink = (router: NextRouter, tab: CaseDetailsTab): string => {
  const [path, query] = router.asPath.split("?")
  const params = new URLSearchParams(query)

  params.set("tab", tab)

  return `${path}?${params}`
}
