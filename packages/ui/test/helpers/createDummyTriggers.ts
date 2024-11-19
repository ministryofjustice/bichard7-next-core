import type { DataSource, EntityManager } from "typeorm"

import { faker } from "@faker-js/faker"
import exponential from "@stdlib/random-base-exponential"
import sample from "@stdlib/random-sample"

import Trigger from "../../src/services/entities/Trigger"
import randomDate from "./createRandomDate"
import createResolutionStatus from "./createResolutionStatus"

const triggerFrequency = {
  TRPR0001: 61787,
  TRPR0002: 42440,
  TRPR0003: 17036,
  TRPR0004: 13234,
  TRPR0005: 22550,
  TRPR0006: 16712,
  TRPR0007: 331,
  TRPR0008: 4214,
  TRPR0010: 86986,
  TRPR0012: 28800,
  TRPR0015: 112166,
  TRPR0016: 12386,
  TRPR0017: 117,
  TRPR0018: 2666,
  TRPR0019: 359,
  TRPR0020: 74545,
  TRPR0021: 363,
  TRPR0022: 1470,
  TRPR0023: 12229,
  TRPR0024: 588,
  TRPR0025: 15509,
  TRPR0026: 528,
  TRPR0027: 9090,
  TRPR0028: 573,
  TRPR0029: 27602,
  TRPR0030: 9239,
  TRPS0002: 41,
  TRPS0003: 347,
  TRPS0004: 557,
  TRPS0008: 2675,
  TRPS0010: 18047,
  TRPS0011: 16957,
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
    probs,
    replace: true,
    size: numTriggers
  })

  return triggerCodes.map((triggerCode, idx) => {
    const thisTriggerStatus = isResolved ? "Resolved" : createResolutionStatus()
    return dataSource.getRepository(Trigger).create({
      createdAt: creationDate,
      errorId,
      resolvedAt: thisTriggerStatus === "Resolved" ? randomDate(creationDate, dateTo || new Date()) : null,
      resolvedBy:
        thisTriggerStatus === "Resolved"
          ? `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}`.slice(0, 31)
          : null,
      status: thisTriggerStatus,
      triggerCode: triggerCode,
      triggerItemIdentity: idx
    })
  })
}
