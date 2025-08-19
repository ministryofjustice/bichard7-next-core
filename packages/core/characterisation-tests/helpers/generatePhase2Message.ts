import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import MessageType from "../types/MessageType"
import generateMessage from "./generateMessage"

export type Duration = {
  length: number
  type: string
  unit: string
}

export type GeneratePhase2MessageOptions = {
  arrestSummonsNumber?: string
  hoTemplate?: "AintCase" | "NoOperationsAndExceptions"
  messageType: MessageType
  normalDisposalOperation?: Operation<PncOperation.NORMAL_DISPOSAL>
  offences?: Offence[]
  penaltyNoticeCaseReference?: boolean
  penaltyNoticeCaseReferenceNumber?: string
  pncAdjudication?: PncAdjudication
  pncDisposals?: PncDisposal[]
  pncId?: string
  recordableOnPncIndicator?: boolean
}

type Offence = {
  addedByTheCourt?: boolean
  courtCaseReferenceNumber?: boolean
  offenceCategory?: OffenceCategory
  offenceReasonSequence?: boolean
  recordableOnPncIndicator?: boolean
  results?: Result[]
}

type OffenceCategory = {
  code: string
  description: string
}

type PncAdjudication = {}

type PncDisposal = {
  type: number
}

type Result = {
  amountSpecifiedInResults?: number[]
  cjsResultCode?: number
  durations?: Duration[]
  numberOfOffencesTic?: boolean
  pncAdjudicationExists?: boolean
  pncDisposalType?: number
  resultClass?: ResultClass
  resultQualifierVariables?: ResultQualifierVariable[]
  resultVariableText?: string
}

type ResultQualifierVariable = {
  code: number
  duration?: Duration
}

const updateOptionsForNoOperationsAndExceptions = (
  options: GeneratePhase2MessageOptions
): GeneratePhase2MessageOptions => {
  if (process.env.USE_BICHARD === "true" && options.messageType === MessageType.PNC_UPDATE_DATASET) {
    throw Error("This test only works in the new Bichard")
  }

  options.recordableOnPncIndicator = true
  if (!options.offences || options.offences.length === 0) {
    options.offences = [{}]
  }

  options.offences?.forEach((offence) => {
    offence.addedByTheCourt = true
    if (!offence.results || offence.results.length === 0) {
      offence.results = [{}]
    }

    offence.results?.forEach((result) => {
      result.resultClass = ResultClass.SENTENCE
      result.pncAdjudicationExists = false
    })
  })

  return options
}

const updateOptionsForAintCase = (options: GeneratePhase2MessageOptions): GeneratePhase2MessageOptions => {
  options.recordableOnPncIndicator = true
  if (!options.offences || options.offences.length === 0) {
    options.offences = [{}]
  }

  const offence = options.offences[0]
  offence.addedByTheCourt = false
  offence.results = !offence.results || offence.results.length === 0 ? [{}] : offence.results
  offence.results[0].pncDisposalType = 1000
  offence.results[0].resultVariableText = "Hearing on 01/01/2025 confirmed."

  return options
}

const generatePhase2Message = (options: GeneratePhase2MessageOptions): string => {
  if (options.hoTemplate === "NoOperationsAndExceptions") {
    options = updateOptionsForNoOperationsAndExceptions(options)
  } else if (options.hoTemplate === "AintCase") {
    options = updateOptionsForAintCase(options)
  }

  return generateMessage("test-data/Message.xml.njk", options)
}

export default generatePhase2Message
