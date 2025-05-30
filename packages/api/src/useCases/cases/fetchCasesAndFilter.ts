import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { CaseDataForIndexDto } from "../../types/Case"
import type { Filters, Pagination, SortOrder } from "../../types/CaseIndexQuerystring"

import { convertCaseToCaseIndexDto } from "../dto/convertCaseToDto"

const assignNotesAndTriggers = async (
  dataStore: DataStoreGateway,
  cases: CaseDataForIndexDto[],
  filters: Filters,
  user: User
) => {
  const errorIds = cases.map((caseData) => caseData.error_id)
  const notes = await dataStore.fetchNotes(errorIds)
  const triggers = await dataStore.fetchTriggers(errorIds, filters, user)

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

export const fetchCasesAndFilter = async (
  dataStore: DataStoreGateway,
  query: ApiCaseQuery,
  user: User
): Promise<CaseIndexMetadata> => {
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

  const [caseAges, cases] = await Promise.all([
    dataStore.fetchCaseAges(user),
    dataStore.fetchCases(user, pagination, sortOrder, filters)
  ])

  if (cases.length === 0) {
    return {
      caseAges,
      cases: [],
      returnCases: 0,
      totalCases: 0,
      ...pagination
    } satisfies CaseIndexMetadata
  }

  await assignNotesAndTriggers(dataStore, cases, filters, user)

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
