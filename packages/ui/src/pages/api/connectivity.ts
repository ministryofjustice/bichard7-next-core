import type { NextApiRequest, NextApiResponse } from "next"
import type { ApiConnectivityDto } from "@moj-bichard7/common/types/ApiConnectivity"

import ApiClient from "services/api/ApiClient"
import BichardApiV1 from "services/api/BichardApiV1"
import { isError } from "types/Result"
import logger from "utils/logger"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers["x-connectivity-check-key"] as string
  if (!apiKey) {
    res.statusCode = 401
    res.statusMessage = "Unauthorized"
    res.end()
    return
  }

  const apiClient = new ApiClient("") // Does not require auth via JWT
  const apiGateway = new BichardApiV1(apiClient)

  const apiConnectivityResult = await apiGateway.connectivity(apiKey)
  let apiConnectivity: false | ApiConnectivityDto
  if (isError(apiConnectivityResult)) {
    logger.error(`Connectivity endpoint failed to connect to the API: ${apiConnectivityResult.message}`)
    apiConnectivity = false
  } else {
    apiConnectivity = apiConnectivityResult
  }

  res.status(200).json({
    api: apiConnectivity
  })
}
