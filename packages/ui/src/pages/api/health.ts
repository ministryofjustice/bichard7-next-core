import { CSRF } from "config"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const { NODE_ENV } = process.env

  if (NODE_ENV === "production" && CSRF.formSecret === "OliverTwist2") {
    res.status(500).end()
  } else {
    res.status(200).end()
  }
}
