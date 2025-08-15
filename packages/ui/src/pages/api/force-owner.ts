import type { NextApiRequest, NextApiResponse } from "next"

import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"

import type ForceOwnerApiResponse from "../../types/ForceOwnerApiResponse"

import searchForceOwners, { getForceCode, getForceName } from "../../services/searchForceOwners"

export default async (request: NextApiRequest, response: NextApiResponse<ForceOwnerApiResponse>) => {
  const allowedMethods = ["GET"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res } = auth

  const searchQueryString = ((typeof req.query.search === "string" && req.query.search) || "").toLowerCase()

  const filteredItems = searchForceOwners(searchQueryString).map((ou) => ({
    forceCode: getForceCode(ou),
    forceName: getForceName(ou)
  }))

  res.status(200).json(filteredItems.slice(0, 20))
}
