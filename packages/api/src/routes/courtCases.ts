import { Router } from "express"
import auth from "../middleware/auth"
import { validateCaseListQueryParams } from "../middleware/validate"
import { getCourtCases } from "../controllers/courtCases"

const router: Router = Router()

router.use(auth)

router.get("/", validateCaseListQueryParams, getCourtCases)

export default router
