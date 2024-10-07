import type { ConnectionOptions as TlsConnectionOptions } from "tls"
import MqConfig from "./types/MqConfig"
import deconstructServers from "./deconstructServers"

const config: MqConfig = {
  url: "failover:(stomp://localhost:61613)",
  username: "admin",
  password: "admin"
}

describe("deconstructServers()", () => {
  it("Should extract 1 server when there is only 1 failover URL", () => {
    const url = "failover:(stomp+ssl://host1:1111)"
    const servers = deconstructServers({
      ...config,
      url
    })

    expect(servers).toHaveLength(1)

    const server = servers[0]
    expect(server.connectHeaders?.login).toBe(config.username)
    expect(server.connectHeaders?.passcode).toBe(config.password)

    const tlsOptions = <TlsConnectionOptions>server
    expect(tlsOptions.host).toBe("host1")
    expect(tlsOptions.port).toBe(1111)
  })

  it("Should extract 2 servers when there are 2 failover URLs", () => {
    const url = "failover:(stomp+ssl://host1:1111,stomp://host2:2222)"
    const servers = deconstructServers({
      ...config,
      url
    })

    expect(servers).toHaveLength(2)

    const server1 = servers[0]
    expect(server1.ssl).toBe(true)
    expect(server1.connectHeaders?.login).toBe(config.username)
    expect(server1.connectHeaders?.passcode).toBe(config.password)

    const tlsOptions1 = <TlsConnectionOptions>server1
    expect(tlsOptions1.host).toBe("host1")
    expect(tlsOptions1.port).toBe(1111)

    const server2 = servers[1]
    expect(server2.ssl).toBe(false)
    expect(server2.connectHeaders?.login).toBe(config.username)
    expect(server2.connectHeaders?.passcode).toBe(config.password)

    const tlsOptions2 = <TlsConnectionOptions>server2
    expect(tlsOptions2.host).toBe("host2")
    expect(tlsOptions2.port).toBe(2222)
  })
})
