import build from "./app"
import Postgres from "./services/gateways/dataStoreGateways/postgres"

async function start() {
  const port: number = parseInt(process.env.PORT ?? "3321", 10)
  const app = await build({ db: new Postgres() })

  await app.ready()

  app.listen({ port, host: "0.0.0.0" })
}

start()
