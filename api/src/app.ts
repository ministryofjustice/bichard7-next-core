import type { Application } from "express"
import express from "express"
import cors from "cors"
import healthRouter from "./routes/health"
import courtCaseRouter from "./routes/courtCases"

const app: Application = express()
app.use(cors())

app.use("/health", healthRouter)
app.use("/cases", courtCaseRouter)

export default app
