import config from "../../lib/config"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const { NODE_ENV } = process.env

  if (
    NODE_ENV === "production" &&
    (config.csrf.cookieSecret === "OliverTwist1" || config.csrf.formSecret === "OliverTwist2")
  ) {
    res.status(500).end()
  } else {
    res.status(200).end()
  }
}
