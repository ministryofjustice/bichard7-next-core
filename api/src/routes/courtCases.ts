import { Router } from "express"
import { validateCaseListQueryParams } from "../middleware/validate"
import { getCourtCases } from "../controllers/courtCases"

const router: Router = Router()

router.get("/", validateCaseListQueryParams, getCourtCases)

export default router
