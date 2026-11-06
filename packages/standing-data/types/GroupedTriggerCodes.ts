import TriggerCode, { TriggerCodeGroups } from "./TriggerCode"

const GroupedTriggerCodes: Record<TriggerCodeGroups, TriggerCode[]> = {
  [TriggerCodeGroups.Bails]: [TriggerCode.TRPR0008, TriggerCode.TRPR0010, TriggerCode.TRPR0019, TriggerCode.TRPR0030],
  [TriggerCodeGroups.Results]: [TriggerCode.TRPR0006, TriggerCode.TRPR0016, TriggerCode.TRPR0020, TriggerCode.TRPR0025],
  [TriggerCodeGroups.Custody]: [TriggerCode.TRPR0005],
  [TriggerCodeGroups.Orders]: [
    TriggerCode.TRPR0003,
    TriggerCode.TRPS0008,
    TriggerCode.TRPR0021,
    TriggerCode.TRPR0026,
    TriggerCode.TRPR0029
  ],
  [TriggerCodeGroups.Warrants]: [TriggerCode.TRPR0002, TriggerCode.TRPR0012]
}

export default GroupedTriggerCodes
