import type MqConfig from "./MqConfig"

export default (): MqConfig => {
  const { MQ_USER, MQ_PASSWORD, MQ_URL } = process.env

  if (!MQ_USER || !MQ_PASSWORD || !MQ_URL) {
    throw Error("MQ environment variables must all have value.")
  }

  return {
    url: MQ_URL,
    username: MQ_USER,
    password: MQ_PASSWORD
  }
}
