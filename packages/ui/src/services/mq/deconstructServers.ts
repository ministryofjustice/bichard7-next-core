import type { connect } from "stompit"
import type { ConnectionOptions as TlsConnectionOptions } from "tls"
import MqConfig from "./types/MqConfig"
import parseConnectionOptions from "./parseConnectionOptions"

export default (config: MqConfig): connect.ConnectOptions[] => {
  const connectHeaders: connect.ConnectHeaders = {
    login: config.username,
    passcode: config.password,
    "heart-beat": "5000,5000"
  }

  let { url } = config
  if (/^failover:\(.*\)$/.test(url)) {
    // Remove the failover:() wrapper
    url = url.substring("failover:(".length)
    url = url.substring(0, url.length - 1)
  }

  const servers = url.split(",")
  return servers.map((serverUrl) => {
    const options = parseConnectionOptions(serverUrl)

    const tlsOptions: TlsConnectionOptions = {
      host: options.host,
      port: options.port,
      timeout: 10000
    }

    // We cannot use `ssl: options.ssl` as the stompit library changes the `ssl`
    // property from a `boolean` type to only `true` values for the
    // `SslConnectionOptions` type and only `false` values for the other two types.
    if (options.ssl) {
      return {
        ...tlsOptions,
        connectHeaders,
        ssl: true
      }
    }

    // We need to explicitly cast this otherwise TypeScript tries to take this
    // as the SslConnectionOptions type, which is wrong
    return <connect.ConnectOptions>{
      ...tlsOptions,
      connectHeaders,
      ssl: false
    }
  })
}
