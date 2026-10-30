import type { CommunitySentenceReportQuery } from "@moj-bichard7/common/contracts/CommunitySentenceReport"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { endOfDay, startOfDay } from "date-fns"

import type { TransactionConnection } from "../../../../types/DatabaseGateway"
import type { CommunitySentenceRowReport } from "../../../../types/reports/CommunitySentence"

import { processCommunitySentenceReport } from "../../../../useCases/cases/reports/communitySentence/processCommunitySentenceReport"
import { organisationUnitSql } from "../../organisationUnitSql"

const COMMUNITY_SENTENCE_TRIGGER = TriggerCode.TRPR0031
const DOMESTIC_VIOLENCE_TRIGGERS = [TriggerCode.TRPR0024, TriggerCode.TRPR0023]

export async function* communitySentenceReport(
  database: TransactionConnection,
  user: User,
  filters: CommunitySentenceReportQuery
): AsyncGenerator<CommunitySentenceReportDto[]> {
  const query = database.connection<CommunitySentenceRowReport[]>`
  SELECT
    el.error_id,
    el.annotated_msg,
    el.defendant_name,
    el.msg_received_ts,
    EXISTS (
      SELECT 1
      FROM br7own.error_list_triggers elt
      WHERE elt.error_id = el.error_id
        AND elt.trigger_code = ANY (${DOMESTIC_VIOLENCE_TRIGGERS})
    ) AS domestic_violence_flag
  FROM br7own.error_list el
  WHERE
    el.msg_received_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
    AND (${organisationUnitSql(database, user)})
    AND EXISTS (
      SELECT 1
      FROM br7own.error_list_triggers elt
      WHERE elt.error_id = el.error_id
        AND elt.trigger_code = ${COMMUNITY_SENTENCE_TRIGGER}
    )
  ORDER BY el.msg_received_ts
  `

  try {
    const cursor = query.cursor(100)
    for await (const rows of cursor) {
      yield processCommunitySentenceReport(rows, filters.resultCodes)
    }
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
