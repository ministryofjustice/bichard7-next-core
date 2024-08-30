import parseJwtCookie from "middleware/withAuthentication/parseJwtCookie"
import { NextApiRequest, NextApiResponse } from "next"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import getUser from "services/getUser"
import { Result, isError } from "types/Result"

export default async function withApiAuthentication(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
) {
  const authJwt = parseJwtCookie(req)
  let currentUser: Result<User | null> = null

  if (authJwt) {
    const dataSource = await getDataSource()
    currentUser = await getUser(dataSource, authJwt.username, authJwt.groups)
  }

  if (isError(currentUser)) {
    console.error("Failed to retrieve user with error:", currentUser.message)

    res.statusCode = 502
    res.statusMessage = "Bad Gateway"
    res.end()
    return
  }

  if (!currentUser) {
    res.statusCode = 401
    res.statusMessage = "Unauthorized"
    res.end()
    return
  }

  if (!allowedMethods.some((allowedMethod) => allowedMethod === req.method)) {
    res.statusCode = 401
    res.statusMessage = "Unauthorized"
    res.end()
    return
  }

  return { req, res, currentUser }
}
