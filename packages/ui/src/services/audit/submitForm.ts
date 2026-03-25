import { AuditDtoSchema } from "@moj-bichard7/common/types/Audit"
import type { FormState } from "types/audit/FormState"
import createRequest from "./createRequest"
import readFormState from "./readFormState"

async function submitForm(_formState: FormState, formData: FormData): Promise<FormState> {
  const newState = readFormState(formData)

  const request = createRequest(newState)

  const result = await fetch("/bichard/api/audit", {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (result.ok) {
    const raw = await result.json()

    const auditResult = AuditDtoSchema.safeParse(raw)
    if (auditResult.success) {
      return { ...newState, errorMessage: undefined, auditId: auditResult.data.auditId }
    } else {
      return { errorMessage: "There was a problem creating the audit report", ...newState }
    }
  } else {
    return { errorMessage: "There was a problem creating the audit report", ...newState }
  }
}

export default submitForm
