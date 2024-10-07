import { faker } from "@faker-js/faker"
import exponential from "@stdlib/random-base-exponential"
import sample from "@stdlib/random-sample"
import { DataSource, EntityManager } from "typeorm"
import Trigger from "../../src/services/entities/Trigger"
import randomDate from "./createRandomDate"
import createResolutionStatus from "./createResolutionStatus"

const triggerFrequency = {
  TRPR0015: 112166,
  TRPR0010: 86986,
  TRPR0020: 74545,
  TRPR0001: 61787,
  TRPR0002: 42440,
  TRPR0012: 28800,
  TRPR0029: 27602,
  TRPR0005: 22550,
  TRPS0010: 18047,
  TRPR0003: 17036,
  TRPS0011: 16957,
  TRPR0006: 16712,
  TRPR0025: 15509,
  TRPR0004: 13234,
  TRPR0016: 12386,
  TRPR0023: 12229,
  TRPR0030: 9239,
  TRPR0027: 9090,
  TRPR0008: 4214,
  TRPS0008: 2675,
  TRPR0018: 2666,
  TRPR0022: 1470,
  TRPR0024: 588,
  TRPR0028: 573,
  TRPS0004: 557,
  TRPR0026: 528,
  TRPR0021: 363,
  TRPR0019: 359,
  TRPS0003: 347,
  TRPR0007: 331,
  TRPR0017: 117,
  TRPS0002: 41,
  TRPS0013: 19
}
const totalFrequency = Object.values(triggerFrequency).reduce((a, b) => a + b, 0)
const probs = Object.values(triggerFrequency).map((freq) => freq / totalFrequency)

export default (
  dataSource: DataSource | EntityManager,
  errorId: number,
  creationDate: Date,
  dateTo: Date,
  isResolved?: boolean
): Trigger[] => {
  const numTriggers = Math.min(Math.round(exponential(2) * 2), 5) + 1
  const triggerCodes = sample(Object.keys(triggerFrequency), {
    size: numTriggers,
    probs,
    replace: true
  })

  return triggerCodes.map((triggerCode, idx) => {
    const thisTriggerStatus = isResolved ? "Resolved" : createResolutionStatus()
    return dataSource.getRepository(Trigger).create({
      errorId,
      triggerCode: triggerCode,
      status: thisTriggerStatus,
      createdAt: creationDate,
      resolvedBy:
        thisTriggerStatus === "Resolved"
          ? `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}`.slice(0, 31)
          : null,
      triggerItemIdentity: idx,
      resolvedAt: thisTriggerStatus === "Resolved" ? randomDate(creationDate, dateTo || new Date()) : null
    })
  })
}
