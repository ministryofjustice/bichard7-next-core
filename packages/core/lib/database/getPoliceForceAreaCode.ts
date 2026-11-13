import type { Sql } from "postgres"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { onsPostcodeMappingRow } from "../../schemas/onsPostcodeMapping"

const getPoliceForceAreaCode = async (db: Sql, postcode: string): PromiseResult<onsPostcodeMappingRow> => {
  const queryResult = await db<onsPostcodeMappingRow[]>`SELECT * FROM br7own.ons_postcode_mappings
    WHERE postcode = ${postcode}`.catch((error: Error) => error)

  if (isError(queryResult)) {
    return queryResult
  }

  if (queryResult.length === 0) {
    return new Error(`No postcode mapping found for postcode ${postcode}`)
  }

  return queryResult[0]
}

export default getPoliceForceAreaCode
