import type { Audit } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export default async (database: WritableDatabaseConnection, createAudit: CreateAudit): PromiseResult<Audit> => {
  return {
    auditId: 1,
    completedWhen: new Date(),
    createdBy: "hello",
    createdWhen: new Date(),
    fromDate: new Date(),
    includedTypes: ["Triggers", "Exceptions"],
    resolvedByUsers: ["user@example.com"],
    toDate: new Date(),
    triggerTypes: null,
    volumeOfCases: 20
  }
}
