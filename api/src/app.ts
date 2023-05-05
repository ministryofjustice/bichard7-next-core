import type { Application } from "express"
import express from "express"
import cors from "cors"
import queryParser from "./middleware/queryParser"
import healthRouter from "./routes/health"
import courtCaseRouter from "./routes/courtCases"

const app: Application = express()
app.use(cors())
app.use(queryParser)

app.use("/health", healthRouter)
app.use("/court-cases", courtCaseRouter)

export default app
