import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { CaseDataForIndexDto, Pagination } from "../../types/Case"
import type { CaseIndexQuerystring } from "../../types/CaseIndexQuerystring"

import { convertCaseToCaseIndexDto } from "../dto/convertCaseToDto"

const assignNotesAndTriggers = async (dataStore: DataStoreGateway, cases: CaseDataForIndexDto[]) => {
  const errorIds = cases.map((caseData) => caseData.error_id)
  const notes = await dataStore.fetchNotes(errorIds)
  const triggers = await dataStore.fetchTriggers(errorIds)

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
  query: CaseIndexQuerystring,
  user: User
): Promise<CaseIndexMetadata> => {
  const pagination: Pagination = { maxPerPage: query.maxPerPage, pageNum: query.pageNum }

  const cases = await dataStore.fetchCases(pagination)

  if (cases.length === 0) {
    return {
      cases: [],
      returnCases: 0,
      totalCases: 0,
      ...pagination
    } satisfies CaseIndexMetadata
  }

  await assignNotesAndTriggers(dataStore, cases)

  const fullCount = Number(cases[0].full_count)
  const casesDto = cases.map((caseData) => convertCaseToCaseIndexDto(caseData, user))

  return {
    cases: casesDto,
    returnCases: cases.length,
    totalCases: fullCount,
    ...pagination
  } satisfies CaseIndexMetadata
}
