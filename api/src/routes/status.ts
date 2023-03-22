import { Router } from "express"
import { checkStatus } from "../controllers/status"

const router: Router = Router()

router.get("/", checkStatus)

export default router
