import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type { OutputApiAuditLog } from "./AuditLog"

export default interface MessageFetcher {
  fetch: () => PromiseResult<null | OutputApiAuditLog | OutputApiAuditLog[] | undefined>
}
