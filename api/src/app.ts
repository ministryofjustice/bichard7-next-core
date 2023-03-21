import type { Application } from "express"
import express from "express"
import cors from "cors"
import statusRouter from "./routes/status"

const app: Application = express()
app.use(cors())

app.use("/status", statusRouter)

export default app
