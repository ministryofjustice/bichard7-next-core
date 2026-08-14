import type { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import type User from "services/entities/User"
import {
  exceptionHandlerHasAccessTo,
  generalHandlerHasAccessTo,
  hasAccessToNone,
  supervisorHasAccessTo,
  triggerHandlerHasAccessTo
} from "../../../helpers/hasAccessTo"
import { insertCourtCasesWithFields } from "../../../utils/insertCourtCases"
import insertException from "../../../utils/manageExceptions"
import type { TestTrigger } from "../../../utils/manageTriggers"
import { insertTriggers } from "../../../utils/manageTriggers"

const courtCode = "36FPA1"
const forceCode = "36"
const anotherUserName = "someoneElse"

export const dummyTriggerCode = "TRPR0001"
export const bailsTriggerCode = "TRPR0010"
export const dummyExceptionCode = "HO100300"

export interface DummyDataUsers {
  exceptionHandler: User
  generalHandler: User
  noGroupsUser: User
  supervisor: User
  triggerHandler: User
}

const getTrigger = (triggerCode: string, status: ResolutionStatus): TestTrigger => {
  return {
    triggerCode: triggerCode,
    status: status,
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  } as TestTrigger
}

export const insertDummyData = async (): Promise<DummyDataUsers> => {
  const insertTestCaseWithTriggersAndExceptions = async (args: {
    caseId: number
    trigger?: {
      triggerResolvedBy?: string
      bailsTrigger?: boolean
    }
    exception?: {
      exceptionResolvedBy?: string
      exceptionCode: string
    }
  }) => {
    const triggerOrBailsTrigger = `${args.trigger?.bailsTrigger ? "Bails Trigger" : "Trigger"}`

    await insertCourtCasesWithFields([
      {
        errorId: args.caseId,
        defendantName: `${
          args.exception?.exceptionResolvedBy
            ? `Exceptions Resolved by ${args.exception.exceptionResolvedBy}`
            : `${args.exception ? "Exceptions Unresolved" : "No exceptions"}`
        }/${
          args.trigger?.triggerResolvedBy
            ? `${triggerOrBailsTrigger} Resolved by ${args.trigger.triggerResolvedBy}`
            : `${args.trigger ? `${triggerOrBailsTrigger} Unresolved` : "No triggers"}`
        }`,
        errorCount: args.exception ? 1 : 0,
        orgForPoliceFilter: courtCode,
        triggerResolvedBy: args.trigger?.triggerResolvedBy,
        triggerResolvedTimestamp: args.trigger?.triggerResolvedBy ? new Date() : null,
        triggerStatus: args.trigger ? (args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved") : null,
        errorStatus: args.exception ? (args.exception?.exceptionResolvedBy ? "Resolved" : "Unresolved") : null,
        errorResolvedTimestamp: args.exception?.exceptionResolvedBy ? new Date() : null,
        triggerCount: args.trigger ? 1 : 0,
        resolutionTimestamp:
          (args.trigger?.triggerResolvedBy && args.exception?.exceptionResolvedBy) ||
          (args.trigger?.triggerResolvedBy && !args.exception) ||
          (args.exception?.exceptionResolvedBy && !args.trigger)
            ? new Date()
            : undefined
      }
    ])
    if (args.trigger) {
      await insertTriggers(
        args.caseId,
        [
          getTrigger(
            args.trigger.bailsTrigger ? bailsTriggerCode : dummyTriggerCode,
            args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved"
          )
        ],
        args.trigger.triggerResolvedBy
      )
    }

    if (args.exception) {
      await insertException(
        args.caseId,
        args.exception.exceptionCode,
        `${args.exception.exceptionCode}||b7.errorReport`,
        args.exception.exceptionResolvedBy ? "Resolved" : "Unresolved",
        args.exception.exceptionResolvedBy
      )
    }
  }

  const noGroupsUser = {
    visibleForces: [forceCode],
    visibleCourts: [],
    groups: [],
    hasAccessTo: hasAccessToNone
  } as Partial<User> as User

  const exceptionHandler = {
    username: "exceptionHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: exceptionHandlerHasAccessTo
  } as Partial<User> as User

  const triggerHandler = {
    username: "triggerHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: triggerHandlerHasAccessTo
  } as Partial<User> as User

  const generalHandler = {
    username: "generalHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: generalHandlerHasAccessTo
  } as Partial<User> as User

  const supervisor = {
    username: "supervisor",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: supervisorHasAccessTo
  } as Partial<User> as User

  await insertTestCaseWithTriggersAndExceptions({
    caseId: 0,
    trigger: {
      triggerResolvedBy: anotherUserName
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 1,
    trigger: {
      triggerResolvedBy: undefined
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: exceptionHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 2,
    trigger: {
      triggerResolvedBy: triggerHandler.username
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: exceptionHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 3,
    trigger: {
      triggerResolvedBy: generalHandler.username
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: anotherUserName
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 4,
    trigger: {
      triggerResolvedBy: anotherUserName
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 5,
    trigger: {
      triggerResolvedBy: generalHandler.username
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 6,
    trigger: {
      triggerResolvedBy: undefined
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 7,
    trigger: {
      triggerResolvedBy: anotherUserName,
      bailsTrigger: true
    },
    exception: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 8,
    trigger: {
      triggerResolvedBy: triggerHandler.username,
      bailsTrigger: true
    },
    exception: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 9,
    trigger: {
      triggerResolvedBy: undefined,
      bailsTrigger: true
    },
    exception: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 10,
    trigger: undefined,
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 11,
    trigger: undefined,
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 12,
    trigger: {
      triggerResolvedBy: generalHandler.username,
      bailsTrigger: true
    },
    exception: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 13,
    trigger: {
      triggerResolvedBy: anotherUserName,
      bailsTrigger: true
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 14,
    trigger: {
      triggerResolvedBy: undefined,
      bailsTrigger: true
    },
    exception: {
      exceptionCode: dummyExceptionCode,
      exceptionResolvedBy: undefined
    }
  })

  return {
    exceptionHandler,
    generalHandler,
    noGroupsUser,
    supervisor,
    triggerHandler
  }
}
