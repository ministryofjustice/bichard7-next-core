import https from "https"
import fs from "fs"
import app from "src/app"

const PORT: string = process.env.PORT || "3333"

if (process.env.USE_SSL === "true") {
  const config = { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") }
  https.createServer(config, app).listen(PORT, () => console.log(`app is listening on https port ${PORT}`))
} else {
  app.listen(PORT, () => console.log(`app is listening on http port ${PORT}`))
}
