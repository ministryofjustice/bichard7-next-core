import type { LedsBichard } from "../../types/LedsMock"
import type CaseData from "../../types/LedsTestApiHelper/CaseData"

const fetchCaseDataFromLedsApi = async (bichard: LedsBichard): Promise<CaseData> => {
  const disposals = await bichard.policeApi.testApiHelper.fetchDisposals()
  const [offences, remands] = await bichard.policeApi.testApiHelper.fetchRemandsAndOffences()
  disposals.forEach((disposal) => {
    disposal.charges.forEach((charge) => {
      charge.offence = offences.find((offence) => offence.id === charge.offenceId)
    })
  })

  return { disposals, remands }
}

export default fetchCaseDataFromLedsApi
