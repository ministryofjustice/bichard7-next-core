import https from "https"
import fs from "fs"
import app from "./app"

const PORT: string = process.env.PORT || "3333"

https
  .createServer(
    {
      key: fs.readFileSync("/certs/server.key"),
      cert: fs.readFileSync("/certs/server.crt")
    },
    app
  )
  .listen(PORT, () => console.log(`app is listening on ${PORT}`))
