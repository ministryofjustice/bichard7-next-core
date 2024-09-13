import cors from "cors"
import type { Application } from "express"
import express from "express"
import healthRouter from "./routes/health"

const app: Application = express()
app.use(cors())

app.use("/health", healthRouter)

export default app
