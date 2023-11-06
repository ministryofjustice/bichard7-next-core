import type MqConfig from "./MqConfig"

const createMqConfig = (): MqConfig => {
  const { MQ_URL, MQ_AUTH } = process.env

  if (!MQ_URL || !MQ_AUTH) {
    throw Error("MQ environment variables must all have value.")
  }

  const { username, password } = JSON.parse(MQ_AUTH)
  if (!username || !password) {
    throw Error("MQ_AUTH environment variable set incorrectly")
  }

  return {
    url: MQ_URL,
    username,
    password
  }
}

export default createMqConfig
