import { SMTP } from "@/config"
import type Emailer from "@moj-bichard7/common/email/Emailer"
import getCommonEmailer from "@moj-bichard7/common/email/getEmailer"
import logger from "utils/logger"

export default function getEmailer(emailAddress: string): Emailer {
  const config = {
    host: SMTP.host,
    port: SMTP.port,
    tls: SMTP.tls,
    user: SMTP.user,
    password: SMTP.password,
    debug: false
  }

  return getCommonEmailer(config, emailAddress, logger)
}
