import type MqConfig from "./types/MqConfig"

export default (): MqConfig => {
  const { MQ_PASSWORD, MQ_URL, MQ_USER } = process.env

  return {
    password: MQ_PASSWORD ?? "admin",
    url: MQ_URL ?? "failover:(stomp://localhost:61613)",
    username: MQ_USER ?? "admin"
  }
}
