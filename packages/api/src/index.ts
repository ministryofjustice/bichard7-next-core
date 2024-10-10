import build from "./app"

async function start() {
  const port: number = parseInt(process.env.PORT ?? "3321", 10)
  const app = await build()

  await app.ready()

  app.listen({ port, host: "0.0.0.0" })
}

start()
