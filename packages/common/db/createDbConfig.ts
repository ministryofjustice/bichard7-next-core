import { baseConfig } from "./baseConfig"

// Note: we are declaring both user and username properties
// in the config object. This is because the pg-promise
// library expects the username property to be present
// in the config object. However, the baseConfig object
// uses the user property. To avoid any confusion,
// we are declaring both properties in the createDbConfig
// function.

const createDbConfig = () =>
  ({
    ...baseConfig,
    username: baseConfig.user,
    max: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    onnotice: () => false
  }) as const

export default createDbConfig
