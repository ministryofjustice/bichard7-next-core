import { Router } from "express"
import { checkStatus } from "src/controllers/health"

const router: Router = Router()

router.get("/", checkStatus)

export default router
