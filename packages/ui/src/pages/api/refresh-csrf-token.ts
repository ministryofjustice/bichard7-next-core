import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import type { NextApiRequest, NextApiResponse } from "next"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["GET"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { res } = auth

  res.status(200)
  res.json({ csrfToken: generateCsrfToken(request) })
  res.end()
}
