import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import searchCourtOrganisationUnits, {
  getFullOrganisationCode,
  getFullOrganisationName
} from "../../services/searchCourtOrganisationUnits"
import OrganisationUnitApiResponse from "../../types/OrganisationUnitApiResponse"

export default async (request: NextApiRequest, response: NextApiResponse<OrganisationUnitApiResponse>) => {
  const allowedMethods = ["GET"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res } = auth

  const searchQueryString = ((typeof req.query.search === "string" && req.query.search) || "").toLowerCase()

  const filteredItems = searchCourtOrganisationUnits(searchQueryString).map((ou) => ({
    fullOrganisationCode: getFullOrganisationCode(ou),
    fullOrganisationName: getFullOrganisationName(ou)
  }))

  res.status(200).json(filteredItems.slice(0, 20))
}
