import * as express from "express"
import * as cors from "cors"
import statusRouter from "./routes/status"

const app: express.Application = express()
app.use(cors())

app.use("/status", statusRouter)

export default app
