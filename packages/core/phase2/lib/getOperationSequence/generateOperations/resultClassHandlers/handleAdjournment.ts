import createRemandOperation from "../createRemandOperation"
import { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournment: ResultClassHandler = ({ result, offence }) =>
  createRemandOperation(result, offence?.CourtCaseReferenceNumber)
