import * as express from "express"
import * as cors from "cors"

const app: express.Application = express()
app.use(cors())

export default app
