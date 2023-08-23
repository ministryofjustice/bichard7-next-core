import { Router } from "express"
import auth from "src/middleware/auth"
import { validateCaseListQueryParams } from "src/middleware/validate"
import { getCourtCases } from "src/controllers/courtCases"

const router: Router = Router()

router.use(auth)

router.get("/", validateCaseListQueryParams, getCourtCases)

export default router
