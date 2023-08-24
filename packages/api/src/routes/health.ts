import { Router } from "express"
import { checkStatus } from "../controllers/health"

const router: Router = Router()

router.get("/", checkStatus)

export default router
