import cors from "cors"
import type { Application } from "express"
import express from "express"
import queryParser from "./middleware/queryParser"
import healthRouter from "./routes/health"

const app: Application = express()
app.use(cors())
app.use(queryParser)

app.use("/health", healthRouter)

export default app
