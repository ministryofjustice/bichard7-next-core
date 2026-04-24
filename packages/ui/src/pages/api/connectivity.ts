import type { NextApiRequest, NextApiResponse } from "next"
import ApiClient from "services/api/ApiClient"
import BichardApiV1 from "services/api/BichardApiV1"
import { isError } from "types/Result"

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

  const apiConnectivity = await apiGateway.connectivity(apiKey)
  if (isError(apiConnectivity)) {
    res.status(400).send(apiConnectivity.message)
    return
  }

  res.status(200).json({
    api: apiConnectivity
  })
}
