import type { QueryOrder } from "types/CaseListQueryParams"

import { useRouter } from "next/router"

export function useColumnSorting(order: QueryOrder) {
  const router = useRouter()
  const { query } = router
  const orderByParams = (orderBy: string) => `?${new URLSearchParams({ ...query, orderBy, order })}`
  const handleHeaderClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, columnName: string) => {
    const target = event.target as HTMLElement
    const headerId = target.closest("button")?.id
    if (headerId) {
      const headerElement = document.getElementById(headerId)
      if (headerElement) {
        headerElement.focus()
      }
    }

    router.push(orderByParams(columnName))
  }

  const ariaSort = (columnName: string) =>
    query.orderBy === columnName ? (query.order === "asc" ? "ascending" : "descending") : "none"

  const ariaLabel = (columnName: string): string => {
    const isSorted = query.orderBy === columnName
    const direction = ariaSort(columnName)
    const readableColumnName = columnName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())
    return isSorted
      ? `${readableColumnName} column, sorted ${direction}, click to change sort order`
      : `${readableColumnName} column, sortable, click to sort ascending`
  }

  return {
    query,
    handleHeaderClick,
    ariaSort,
    ariaLabel
  }
}
