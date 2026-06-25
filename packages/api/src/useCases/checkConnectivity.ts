import type { ApiConnectivityDto } from "@moj-bichard7/common/types/ApiConnectivity"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../types/DatabaseGateway"

import checkLedsConnectivity from "../services/checkLedsConnectivity"
import checkDbConnectivity from "../services/db/checkDbConnectivity"

export default async (database: DatabaseConnection): PromiseResult<ApiConnectivityDto> => {
  const dbConnectivity = await checkDbConnectivity(database)
  if (isError(dbConnectivity)) {
    return dbConnectivity
  }

  const ledsConnectivityResult = await checkLedsConnectivity()
  const ledsConnectivity = isError(ledsConnectivityResult) ? false : ledsConnectivityResult

  return {
    database: dbConnectivity,
    leds: ledsConnectivity
  }
}
