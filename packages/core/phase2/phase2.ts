import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import processPhase2Aho from "./processAho/processPhase2Aho"
import processPhase2PncUpdateDataset from "./processPncUpdateDataset/processPhase2PncUpdateDataset"

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  if (isPncUpdateDataset(message)) {
    return processPhase2PncUpdateDataset(message, auditLogger)
  } else {
    return processPhase2Aho(message, auditLogger)
  }
}

export default phase2
