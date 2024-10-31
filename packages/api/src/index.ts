import build from "./app"
import PostgresGateway from "./services/gateways/dataStoreGateways/postgresGateway"

async function start() {
  const port: number = parseInt(process.env.PORT ?? "3321", 10)
  const app = await build({ dataStoreGateway: new PostgresGateway() })

  await app.ready()

  app.listen({ port, host: "0.0.0.0" })
}

start()
