import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { CaseDataForIndexDto } from "../../types/Case"
import type { Filters, Pagination, SortOrder } from "../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../types/DatabaseGateway"

import { fetchCaseAges } from "../../services/db/cases/fetchCaseAges"
import fetchCases from "../../services/db/cases/fetchCases"
import fetchNotes from "../../services/db/cases/fetchNotes"
import fetchTriggers from "../../services/db/cases/fetchTriggers"
import { convertCaseToCaseIndexDto } from "../dto/convertCaseToDto"

const assignNotesAndTriggers = async (
  database: DatabaseConnection,
  user: User,
  cases: CaseDataForIndexDto[],
  filters: Filters
): PromiseResult<void> => {
  const caseIds = cases.map((caseData) => caseData.error_id)
  const notes = await fetchNotes(database, caseIds)
  if (isError(notes)) {
    return Error(`Error while fetching notes for case ids ${caseIds}: ${notes.message}`)
  }

  const triggers = await fetchTriggers(database, user, caseIds, filters)
  if (isError(triggers)) {
    return Error(`Error while fetching triggers for case ids ${caseIds}: ${triggers.message}`)
  }

  cases.forEach((caseData) => {
    const matchedNotes = notes.filter((note) => note.error_id === caseData.error_id)
    const matchedTriggers = triggers.filter((trigger) => trigger.error_id === caseData.error_id)

    matchedNotes.forEach((note) => {
      if (!caseData.notes) {
        caseData.notes = []
      }

      caseData.notes.push(note)
    })

    matchedTriggers.forEach((trigger) => {
      if (!caseData.triggers) {
        caseData.triggers = []
      }

      caseData.triggers.push(trigger)
    })
  })
}

const fetchCasesAndFilter = async (
  database: DatabaseConnection,
  query: ApiCaseQuery,
  user: User
): PromiseResult<CaseIndexMetadata> => {
  const pagination: Pagination = { maxPerPage: query.maxPerPage, pageNum: query.pageNum }
  const sortOrder: SortOrder = { order: query.order, orderBy: query.orderBy }
  const filters: Filters = {
    allocatedUsername: query.allocatedUsername,
    asn: query.asn,
    caseAge: query.caseAge,
    caseState: query.caseState,
    courtName: query.courtName,
    defendantName: query.defendantName,
    from: query.from,
    lockedState: query.lockedState,
    ptiurn: query.ptiurn,
    reason: query.reason,
    reasonCodes: query.reasonCodes,
    resolvedByUsername: query.resolvedByUsername,
    resolvedFrom: query.resolvedFrom,
    resolvedTo: query.resolvedTo,
    to: query.to
  }

  const caseAges = await fetchCaseAges(database, user)
  if (isError(caseAges)) {
    return caseAges
  }

  const cases = await fetchCases(database, user, pagination, sortOrder, filters)
  if (isError(cases)) {
    return cases
  }

  if (cases.length === 0) {
    return {
      caseAges,
      cases: [],
      returnCases: 0,
      totalCases: 0,
      ...pagination
    } satisfies CaseIndexMetadata
  }

  const assignNotesAndTriggersResult = await assignNotesAndTriggers(database, user, cases, filters)
  if (isError(assignNotesAndTriggersResult)) {
    return Error(`Failed to assign notes and triggers: ${assignNotesAndTriggersResult.message}`)
  }

  const fullCount = Number(cases[0].full_count)
  const casesDto = cases.map((caseData) => convertCaseToCaseIndexDto(caseData, user))

  return {
    caseAges,
    cases: casesDto,
    returnCases: cases.length,
    totalCases: fullCount,
    ...pagination
  } satisfies CaseIndexMetadata
}

export default fetchCasesAndFilter
