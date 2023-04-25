import https from "https"
import fs from "fs"
import app from "./app"

const PORT: string = process.env.PORT || "3333"

if (process.env.NODE_ENV === "production") {
  const config = { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") }
  https.createServer(config, app).listen(PORT, () => console.log(`app is listening on ${PORT}`))
} else {
  app.listen(PORT, () => console.log(`app is listening on ${PORT}`))
}
