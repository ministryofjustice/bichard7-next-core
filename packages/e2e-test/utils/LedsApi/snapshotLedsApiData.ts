import { writeFileSync } from "fs"
import type { LedsBichard } from "../../types/LedsMock"
import type CaseData from "../../types/LedsTestApiHelper/CaseData"
import { delay } from "../puppeteer-utils"

const snapshotLedsApiData = async (
  bichard: LedsBichard,
  beforeOrAfterRunningTest: "before" | "after"
): Promise<void> => {
  await delay(15)
  const disposals = await bichard.policeApi.testApiHelper.fetchDisposals()
  const [offences, remands] = await bichard.policeApi.testApiHelper.fetchRemandsAndOffences()
  disposals.forEach((disposal) => {
    disposal.charges.forEach((charge) => {
      charge.offence = offences.find((offence) => offence.id === charge.offenceId)
    })
  })

  const caseData: CaseData = { disposals, remands }

  writeFileSync(`${bichard.specFolder}/police-data.${beforeOrAfterRunningTest}.json`, JSON.stringify(caseData, null, 2))
}

export default snapshotLedsApiData
