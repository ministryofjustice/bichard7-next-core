import type Emailer from "@moj-bichard7/common/email/Emailer"
import getCommonEmailer from "@moj-bichard7/common/email/getEmailer"
import config from "lib/config"
import logger from "utils/logger"

export default function getEmailer(emailAddress: string): Emailer {
  const localConfig = {
    host: config.smtp.host,
    port: config.smtp.port,
    tls: config.smtp.tls,
    user: config.smtp.user,
    password: config.smtp.password,
    debug: false
  }

  return getCommonEmailer(localConfig, emailAddress, logger)
}
