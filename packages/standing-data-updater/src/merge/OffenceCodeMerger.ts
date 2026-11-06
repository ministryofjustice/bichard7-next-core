import type { OffenceCode } from "../types/OffenceCode"
import type HomeOfficeClassifictionPriority from "./HomeOfficeClassificationPriority"
import type NotifiableToHOPriority from "./NotifiableToHOPriority"
import type OffenceCategoryPriority from "./OffenceCategoryPriority"
import type OffenceTitlePriority from "./OffenceTitlePriority"
import type RecordableOnPncPriority from "./RecordableOnPncPriority"

export default class OffenceCodeMerger {
  constructor(
    private offenceCodeKeys: Set<string>,
    private homeOfficeClassification: HomeOfficeClassifictionPriority,
    private notifiableToHo: NotifiableToHOPriority,
    private offenceCategory: OffenceCategoryPriority,
    private offenceTitle: OffenceTitlePriority,
    private recordableOnPnc: RecordableOnPncPriority
  ) {}

  merge(): OffenceCode[] {
    return Array.from(this.offenceCodeKeys).map((cjsCode) => {
      return {
        cjsCode,
        description: cjsCode,
        homeOfficeClassification: this.homeOfficeClassification.getHighestPriority(cjsCode),
        notifiableToHo: this.notifiableToHo.getHighestPriority(cjsCode),
        offenceCategory: this.offenceCategory.getHighestPriority(cjsCode),
        offenceTitle: this.offenceTitle.getHighestPriority(cjsCode),
        recordableOnPnc: this.recordableOnPnc.getHighestPriority(cjsCode)
      }
    })
  }
}
