import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

export default async (database: DatabaseConnection): PromiseResult<boolean> => {
  try {
    // Query should run within 2 seconds
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))

    await Promise.race([database.connection`SELECT 1 as connected`, timeout])

    return true
  } catch {
    return false
  }
}
