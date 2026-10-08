import type { CommunitySentenceReportQuery } from "@moj-bichard7/common/contracts/CommunitySentenceReport"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { endOfDay, startOfDay } from "date-fns"

import type { TransactionConnection } from "../../../../types/DatabaseGateway"
import type { CommunitySentenceRowReport } from "../../../../types/reports/CommunitySentence"

import { processCommunitySentenceReport } from "../../../../useCases/cases/reports/communitySentence/processCommunitySentenceReport"
import { organisationUnitSql } from "../../organisationUnitSql"

const COMMUNITY_SENTENCE_TRIGGERS = [TriggerCode.TRPR0031]

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
      json_agg(
        json_build_object(
          'status', elt.status,
          'resolved_ts', elt.resolved_ts,
          'trigger_code', elt.trigger_code
        ) ORDER BY elt.resolved_ts DESC
      ) AS triggers
    FROM br7own.error_list el
    INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
    WHERE
      el.msg_received_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
      AND elt.trigger_code = ANY (${COMMUNITY_SENTENCE_TRIGGERS})
      AND (${organisationUnitSql(database, user)})
    GROUP BY
      el.error_id,
      el.annotated_msg,
      el.defendant_name,
      el.msg_received_ts
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
