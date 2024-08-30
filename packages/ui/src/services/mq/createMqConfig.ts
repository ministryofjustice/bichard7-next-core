import MqConfig from "./types/MqConfig"

export default (): MqConfig => {
  const { MQ_USER, MQ_PASSWORD, MQ_URL } = process.env

  return {
    url: MQ_URL ?? "failover:(stomp://localhost:61613)",
    username: MQ_USER ?? "admin",
    password: MQ_PASSWORD ?? "admin"
  }
}
