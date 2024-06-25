import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import phase2Aho from "./phase2Aho"
import phase2PncUpdateDataset from "./pncUpdateDataset/phase2PncUpdateDataset"

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  if (isPncUpdateDataset(message)) {
    return phase2PncUpdateDataset(message, auditLogger)
  } else {
    return phase2Aho(message, auditLogger)
  }
}

export default phase2
