import stompit from "stompit"

const connectOptions = {
  host: "localhost",
  port: 61613,
  connectHeaders: {
    host: "/",
    login: "admin",
    passcode: "admin",
    "heart-beat": "5000,5000"
  }
}

let needToPrintStats = true

const exitHandler = (client: stompit.Client) => {
  if (needToPrintStats) {
    console.log("\nSummarise test results")
    needToPrintStats = false
  }

  client.disconnect()
  process.exit()
}

stompit.connect(connectOptions, (connectError: Error | null, client: stompit.Client) => {
  process.on("exit", exitHandler.bind(null, client))
  process.on("SIGINT", exitHandler.bind(null, client))
  process.on("SIGUSR1", exitHandler.bind(null, client))
  process.on("SIGUSR2", exitHandler.bind(null, client))
  process.on("uncaughtException", exitHandler.bind(null, client))

  if (connectError) {
    console.log("connect error " + connectError.message)
    return
  }

  const subscribeHeaders = {
    destination: "/queue/PROCESSING_VALIDATION_QUEUE",
    ack: "client-individual"
  }

  client.subscribe(subscribeHeaders, (subscribeError: Error | null, message: stompit.Client.Message) => {
    if (subscribeError) {
      console.log("subscribe error " + subscribeError.message)
      return
    }

    message.readString("utf-8", (readError: Error | null, body?: string) => {
      if (readError) {
        console.log("read message error " + readError.message)
        return
      }

      console.log("received message: " + body)

      client.ack(message)
    })
  })
})
