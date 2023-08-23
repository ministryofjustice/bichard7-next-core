import type { Application } from "express"
import express from "express"
import cors from "cors"
import queryParser from "src/middleware/queryParser"
import healthRouter from "src/routes/health"
import courtCaseRouter from "src/routes/courtCases"

const app: Application = express()
app.use(cors())
app.use(queryParser)

app.use("/health", healthRouter)
app.use("/court-cases", courtCaseRouter)

export default app
