import { Router } from "express"
import { getCourtCases } from "../controllers/courtCases"
import auth from "../middleware/auth"
import { validateCaseListQueryParams } from "../middleware/validate"

const router: Router = Router()

router.use(auth)

router.get("/", validateCaseListQueryParams, getCourtCases)

export default router
