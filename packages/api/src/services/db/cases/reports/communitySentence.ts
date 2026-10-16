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
  WITH trigger_summary AS (
    SELECT
      error_id,
      bool_or(trigger_code = ANY (${DOMESTIC_VIOLENCE_TRIGGERS})) AS domestic_violence_flag,
      bool_or(trigger_code = ${COMMUNITY_SENTENCE_TRIGGER}) AS has_community_sentence,
      json_agg(
        json_build_object(
          'status', status,
          'resolved_ts', resolved_ts,
          'trigger_code', trigger_code
        ) ORDER BY resolved_ts DESC
      ) AS triggers
    FROM br7own.error_list_triggers
    GROUP BY error_id
  )
  SELECT
    el.error_id,
    el.annotated_msg,
    el.defendant_name,
    el.msg_received_ts,
    ts.domestic_violence_flag,
    ts.triggers
  FROM br7own.error_list el
  INNER JOIN trigger_summary ts ON el.error_id = ts.error_id
  WHERE
    el.msg_received_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
    AND ts.has_community_sentence = TRUE
    AND (${organisationUnitSql(database, user)})
  ORDER BY el.msg_received_ts
`

  try {
    const cursor = query.cursor(100)
    for await (const rows of cursor) {
      yield processCommunitySentenceReport(rows)
    }
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
