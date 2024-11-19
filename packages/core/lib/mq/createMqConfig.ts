import type MqConfig from "./MqConfig"

export default (): MqConfig => {
  const { MQ_AUTH, MQ_URL } = process.env

  if (!MQ_AUTH || !MQ_URL) {
    throw Error("MQ environment variables must all have value.")
  }

  const { password, username } = JSON.parse(MQ_AUTH)
  if (!username || !password) {
    throw Error("MQ_AUTH environment variable set incorrectly")
  }

  return {
    password,
    url: MQ_URL,
    username
  }
}
