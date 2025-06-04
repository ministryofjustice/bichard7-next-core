import type postgres from "postgres"

import { baseConfig } from "./baseConfig"

// Note: we are declaring both user and username properties
// in the config object. This is because the pg-promise
// library expects the username property to be present
// in the config object. However, the baseConfig object
// uses the user property. To avoid any confusion,
// we are declaring both properties in the createDbConfig
// function.

const createDbConfig = (readOnly = false): postgres.Options<{}> => {
  const config: postgres.Options<{}> = {
    ...baseConfig,
    idle_timeout: 20,
    max: 10,
    max_lifetime: 60 * 30,
    onnotice: () => false,
    username: baseConfig.user
  }

  if (!readOnly) {
    return config
  }

  return {
    ...config,
    connection: {
      default_transaction_read_only: true
    },
    host: process.env.DB_READER_HOST ?? "localhost"
  }
}

export default createDbConfig
