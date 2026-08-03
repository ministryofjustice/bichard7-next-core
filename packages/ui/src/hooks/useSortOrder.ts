import type { QueryOrder } from "@/types/CaseListQueryParams"
import { useRouter } from "next/router"

export const useSortOrder = () => {
  const { query } = useRouter()

  const orderBy = query.orderBy as string
  const order = query.order as QueryOrder

  if (!orderBy || !order) {
    return null
  }

  return `Sorted by ${orderBy}, ${order}`
}
