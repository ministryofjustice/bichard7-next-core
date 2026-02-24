import type { CaseRow } from "@moj-bichard7/common/types/Case"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export const fetchCase = async (dbConnection: DatabaseConnection, errorId: number): Promise<CaseRow> => {
  const [caseRow] = await dbConnection.connection<CaseRow[]>`
    SELECT el.*
    FROM br7own.error_list el
    WHERE
      el.error_id = ${errorId}
  `

  return caseRow
}
