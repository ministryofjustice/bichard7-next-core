import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatus, ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { sortBy } from "lodash"

import type { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import type { Filters, Pagination } from "../../../../../../types/CaseIndexQuerystring"

import { createCase } from "../../../../../../tests/helpers/caseHelper"
import { createExceptionOnCase } from "../../../../../../tests/helpers/exceptionHelper"
import { createTriggers } from "../../../../../../tests/helpers/triggerHelper"
import { createUser } from "../../../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../../../useCases/cases/getCases/fetchCasesAndFilter"
import { resolutionStatusCodeByText } from "../../../../../../useCases/dto/convertResolutionStatus"
import * as Utils from "./utils"

export type CreateReasonCaseProps = {
  caseId: number
  exception?: {
    exceptionCode: string
    exceptionResolvedBy?: string
  }
  trigger?: {
    bailsTrigger?: boolean
    triggerResolvedBy?: string
  }
}

export const generateName = (args: CreateReasonCaseProps) => {
  const triggerOrBailsTrigger = `${args.trigger?.bailsTrigger ? "Bails Trigger" : "Trigger"}`
  const expectedTestName = []

  if (args.exception?.exceptionResolvedBy) {
    expectedTestName.push(`Exceptions Resolved by ${args.exception.exceptionResolvedBy}`)
  } else {
    expectedTestName.push(`${args.exception ? "Exceptions Unresolved" : "No exceptions"}`)
  }

  if (args.trigger?.triggerResolvedBy) {
    expectedTestName.push(`${triggerOrBailsTrigger} Resolved by ${args.trigger.triggerResolvedBy}`)
  } else if (args.trigger) {
    expectedTestName.push(`${triggerOrBailsTrigger} Unresolved`)
  } else {
    expectedTestName.push("No triggers")
  }

  return expectedTestName
}

export const generateExceptionStatus = (args: CreateReasonCaseProps) => {
  let exceptionErrorStatus: null | number = null

  if (args.exception) {
    exceptionErrorStatus = args.exception?.exceptionResolvedBy
      ? ResolutionStatusNumber.Resolved
      : ResolutionStatusNumber.Unresolved
  }

  return exceptionErrorStatus
}

export const generateTriggerStatus = (args: CreateReasonCaseProps) => {
  let triggerErrorStatus: null | number = null

  if (args.trigger) {
    triggerErrorStatus = args.trigger.triggerResolvedBy
      ? ResolutionStatusNumber.Resolved
      : ResolutionStatusNumber.Unresolved
  }

  return triggerErrorStatus
}

export const createReasonCase = async (
  helper: SetupAppEnd2EndHelper,
  courtCode: string,
  args: CreateReasonCaseProps
) => {
  const expectedTestName = generateName(args)

  await createCase(helper.postgres, {
    defendantName: expectedTestName.join("/"),
    errorCount: args.exception ? 1 : 0,
    errorId: args.caseId,
    errorResolvedAt: args.exception?.exceptionResolvedBy ? new Date() : null,
    errorResolvedBy: args.exception?.exceptionResolvedBy ?? null,
    errorStatus: generateExceptionStatus(args),
    messageId: randomUUID(),
    orgForPoliceFilter: courtCode,
    resolutionAt:
      (args.trigger?.triggerResolvedBy && args.exception?.exceptionResolvedBy) ||
      (args.trigger?.triggerResolvedBy && !args.exception) ||
      (args.exception?.exceptionResolvedBy && !args.trigger)
        ? new Date()
        : null,
    triggerCount: args.trigger ? 1 : 0,
    triggerResolvedAt: args.trigger?.triggerResolvedBy ? new Date() : null,
    triggerResolvedBy: args.trigger?.triggerResolvedBy ? args.trigger.triggerResolvedBy : null,
    triggerStatus: generateTriggerStatus(args)
  })
}

export const getTrigger = (triggerCode: string, status: ResolutionStatus): Trigger => {
  return {
    createdAt: new Date("2022-07-09T10:22:34.000Z"),
    status: resolutionStatusCodeByText(status),
    triggerCode: triggerCode
  } as Trigger
}

export interface DummyDataUsers {
  exceptionHandler: User
  generalHandler: User
  noGroupsUser: User
  supervisor: User
  triggerHandler: User
}

export const dummyTriggerCode = "TRPR0001"
export const bailsTriggerCode = "TRPR0010"
export const dummyExceptionCode1 = "HO100300"
export const dummyExceptionCode2 = "H0100332"

export const insertDummyData = async (helper: SetupAppEnd2EndHelper): Promise<DummyDataUsers> => {
  await helper.postgres.clearDb()
  await helper.dynamo.clearDynamo()

  const courtCode = "36FPA1"
  const forceCode = ["36"]
  const anotherUserName = "someoneElse"

  const insertTestCaseWithTriggersAndExceptions = async (args: Utils.CreateReasonCaseProps) => {
    await createReasonCase(helper, courtCode, args)

    if (args.trigger) {
      await createTriggers(
        helper.postgres,
        args.caseId,
        [
          Utils.getTrigger(
            args.trigger.bailsTrigger ? bailsTriggerCode : dummyTriggerCode,
            args.trigger.triggerResolvedBy ? ResolutionStatus.Resolved : ResolutionStatus.Unresolved
          )
        ],
        args.trigger.triggerResolvedBy
      )
    }

    if (args.exception) {
      await createExceptionOnCase(
        helper.postgres,
        args.caseId,
        args.exception.exceptionCode,
        `${args.exception.exceptionCode}||b7.errorReport`,
        args.exception.exceptionResolvedBy ? ResolutionStatus.Resolved : ResolutionStatus.Unresolved,
        args.exception.exceptionResolvedBy
      )
    }
  }

  const noGroupsUser = await createUser(helper.postgres, {
    groups: [],
    username: "noGroupsUser",
    visibleCourts: [],
    visibleForces: forceCode
  })

  const exceptionHandler = await createUser(helper.postgres, {
    groups: [UserGroup.ExceptionHandler],
    username: "exceptionHandler",
    visibleCourts: [],
    visibleForces: forceCode
  })

  const triggerHandler = await createUser(helper.postgres, {
    groups: [UserGroup.TriggerHandler],
    username: "triggerHandler",
    visibleCourts: [],
    visibleForces: forceCode
  })

  const generalHandler = await createUser(helper.postgres, {
    groups: [UserGroup.GeneralHandler],
    username: "generalHandler",
    visibleCourts: [],
    visibleForces: forceCode
  })

  const supervisor = await createUser(helper.postgres, {
    groups: [UserGroup.Supervisor],
    username: "supervisor",
    visibleCourts: [],
    visibleForces: forceCode
  })

  await insertTestCaseWithTriggersAndExceptions({
    caseId: 0,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: undefined
    },
    trigger: {
      triggerResolvedBy: anotherUserName
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 1,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: exceptionHandler.username
    },
    trigger: {
      triggerResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 2,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: exceptionHandler.username
    },
    trigger: {
      triggerResolvedBy: triggerHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 3,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: anotherUserName
    },
    trigger: {
      triggerResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 4,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: generalHandler.username
    },
    trigger: {
      triggerResolvedBy: anotherUserName
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 5,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: generalHandler.username
    },
    trigger: {
      triggerResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 6,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: undefined
    },
    trigger: {
      triggerResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 7,
    exception: undefined,
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: anotherUserName
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 8,
    exception: undefined,
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: triggerHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 9,
    exception: undefined,
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 10,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: undefined
    },
    trigger: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 11,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: generalHandler.username
    },
    trigger: undefined
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 12,
    exception: undefined,
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: generalHandler.username
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 13,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: generalHandler.username
    },
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: anotherUserName
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 14,
    exception: {
      exceptionCode: dummyExceptionCode1,
      exceptionResolvedBy: undefined
    },
    trigger: {
      bailsTrigger: true,
      triggerResolvedBy: undefined
    }
  })
  await insertTestCaseWithTriggersAndExceptions({
    caseId: 15,
    exception: {
      exceptionCode: dummyExceptionCode2,
      exceptionResolvedBy: undefined
    },
    trigger: undefined
  })

  return {
    exceptionHandler,
    generalHandler,
    noGroupsUser,
    supervisor,
    triggerHandler
  }
}

export const applyFilter = async (filters: Filters, user: () => User, helper: SetupAppEnd2EndHelper) => {
  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
  const result = (await fetchCasesAndFilter(
    helper.postgres.readonly,
    { ...filters, ...defaultQuery },
    user()
  )) as CaseIndexMetadata

  return sortBy(result.cases, "defendantName").map((c) => c.defendantName)
}
