import ResultClass from "../../types/ResultClass"
import MessageType from "../types/MessageType"
import generateMessage from "./generateMessage"

type PncDisposal = {
  type: number
}

type PncAdjudication = {}

export type Duration = {
  type: string
  unit: string
  length: number
}

type ResultQualifierVariable = {
  code: number
  duration?: Duration
}

type Result = {
  cjsResultCode?: number
  resultVariableText?: string
  pncDisposalType?: number
  resultClass?: ResultClass
  pncAdjudicationExists?: boolean
  durations?: Duration[]
  resultQualifierVariables?: ResultQualifierVariable[]
  amountSpecifiedInResults?: number[]
  numberOfOffencesTic?: boolean
}

type OffenceCategory = {
  code: string
  description: string
}

type Offence = {
  offenceReasonSequence?: boolean
  offenceCategory?: OffenceCategory
  recordableOnPncIndicator?: boolean
  addedByTheCourt?: boolean
  results?: Result[]
  courtCaseReferenceNumber?: boolean
}

export type GeneratePhase2MessageOptions = {
  messageType: MessageType
  hoTemplate?: "NoOperationsAndExceptions" | "AintCase"
  penaltyNoticeCaseReference?: boolean
  recordableOnPncIndicator?: boolean
  arrestSummonsNumber?: string
  penaltyNoticeCaseReferenceNumber?: string
  offences?: Offence[]
  pncId?: string
  pncAdjudication?: PncAdjudication
  pncDisposals?: PncDisposal[]
  hasCompletedDisarrOperation?: boolean
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

  return generateMessage("test-data/Phase2Message.xml.njk", options)
}

export default generatePhase2Message
