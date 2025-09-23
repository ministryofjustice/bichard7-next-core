import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason, ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { sortBy } from "lodash"

import type { Filters, Pagination } from "../../../../types/CaseIndexQuerystring"

import { createCase } from "../../../../tests/helpers/caseHelper"
import { createExceptionOnCase } from "../../../../tests/helpers/exceptionHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../tests/helpers/sort"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCase/fetchCasesAndFilter"
import { resolutionStatusCodeByText, ResolutionStatusNumber } from "../../../../useCases/dto/convertResolutionStatus"

type CreateReasonCaseProps = {
  caseId: number
  exception?: {
    exceptionResolvedBy?: string
  }
  trigger?: {
    bailsTrigger?: boolean
    triggerResolvedBy?: string
  }
}

const generateName = (args: CreateReasonCaseProps) => {
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

const generateExceptionStatus = (args: CreateReasonCaseProps) => {
  let exceptionErrorStatus: null | number = null

  if (args.exception) {
    exceptionErrorStatus = args.exception?.exceptionResolvedBy
      ? ResolutionStatusNumber.Resolved
      : ResolutionStatusNumber.Unresolved
  }

  return exceptionErrorStatus
}

const generateTriggerStatus = (args: CreateReasonCaseProps) => {
  let triggerErrorStatus: null | number = null

  if (args.trigger) {
    triggerErrorStatus = args.trigger.triggerResolvedBy
      ? ResolutionStatusNumber.Resolved
      : ResolutionStatusNumber.Unresolved
  }

  return triggerErrorStatus
}

const createReasonCase = async (helper: SetupAppEnd2EndHelper, courtCode: string, args: CreateReasonCaseProps) => {
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

const getTrigger = (triggerCode: string, status: ResolutionStatus): Trigger => {
  return {
    createdAt: new Date("2022-07-09T10:22:34.000Z"),
    status: resolutionStatusCodeByText(status),
    triggerCode: triggerCode
  } as Trigger
}

describe("Filter cases by resolution status", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
  const courtCode = "36FPA1"
  const forceCode = ["36"]
  const anotherUserName = "someoneElse"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  describe("Filter cases having by resolution status, reason code and user permission", () => {
    const dummyTriggerCode = "TRPR0001"
    const bailsTriggerCode = "TRPR0010"

    const insertTestCaseWithTriggersAndExceptions = async (args: CreateReasonCaseProps) => {
      await createReasonCase(helper, courtCode, args)

      if (args.trigger) {
        await createTriggers(
          helper.postgres,
          args.caseId,
          [
            getTrigger(
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
          "HO100300",
          "HO100300||b7.errorReport",
          args.exception.exceptionResolvedBy ? ResolutionStatus.Resolved : ResolutionStatus.Unresolved,
          args.exception.exceptionResolvedBy
        )
      }
    }

    let noGroupsUser: User
    let exceptionHandler: User
    let triggerHandler: User
    let generalHandler: User
    let supervisor: User

    beforeAll(async () => {
      noGroupsUser = await createUser(helper.postgres, {
        groups: [],
        username: "noGroupsUser",
        visibleCourts: [],
        visibleForces: forceCode
      })

      exceptionHandler = await createUser(helper.postgres, {
        groups: [UserGroup.ExceptionHandler],
        username: "exceptionHandler",
        visibleCourts: [],
        visibleForces: forceCode
      })

      triggerHandler = await createUser(helper.postgres, {
        groups: [UserGroup.TriggerHandler],
        username: "triggerHandler",
        visibleCourts: [],
        visibleForces: forceCode
      })

      generalHandler = await createUser(helper.postgres, {
        groups: [UserGroup.GeneralHandler],
        username: "generalHandler",
        visibleCourts: [],
        visibleForces: forceCode
      })

      supervisor = await createUser(helper.postgres, {
        groups: [UserGroup.Supervisor],
        username: "supervisor",
        visibleCourts: [],
        visibleForces: forceCode
      })

      await insertTestCaseWithTriggersAndExceptions({
        caseId: 0,
        exception: {
          exceptionResolvedBy: undefined
        },
        trigger: {
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 1,
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        },
        trigger: {
          triggerResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 2,
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        },
        trigger: {
          triggerResolvedBy: triggerHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 3,
        exception: {
          exceptionResolvedBy: anotherUserName
        },
        trigger: {
          triggerResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 4,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: {
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 5,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: {
          triggerResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 6,
        exception: {
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
          exceptionResolvedBy: undefined
        },
        trigger: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 11,
        exception: {
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
          exceptionResolvedBy: undefined
        },
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: undefined
        }
      })
    })

    const testCases: {
      description: string
      expectedCases: string[]
      filters: Filters
      user: () => User
    }[] = [
      {
        description: "Shouldn't show cases to a user with no permissions",
        expectedCases: [],
        filters: {
          reason: Reason.All
        },
        user: () => noGroupsUser
      },
      {
        description: "Shouldn't show cases to a user with no permissions when a reason filter is passed",
        expectedCases: [],
        filters: {
          reason: Reason.Triggers
        },
        user: () => noGroupsUser
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => triggerHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: ["TRPR0010"]
        },
        user: () => triggerHandler
      },
      {
        description:
          "Should see cases with unresolved exception when user is a exception handler and searches for HO100300",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: ["HO100300"]
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: ["TRPR0010"]
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: ["HO100300"]
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: ["HO100300", "TRPR0010"]
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions and triggers when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["HO100300", "TRPR0010"]
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["HO100300"]
        },
        user: () => generalHandler
      },
      {
        description: "Should see cases with resolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["TRPR0010"]
        },
        user: () => generalHandler
      },
      {
        description: "Should see all cases with resolved triggers when user is a supervisor and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["TRPR0010"]
        },
        user: () => supervisor
      },
      {
        description:
          "Should see all cases with resolved exceptions when user is a supervisor and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["HO100300"]
        },
        user: () => supervisor
      },
      {
        description:
          "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => triggerHandler
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => generalHandler
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a supervisor and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => supervisor
      },
      {
        description:
          "Should see cases with triggers and exceptions, resolved by anyone when user is a supervisor and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => supervisor
      },
      {
        description:
          "Should return cases with unresolved triggers when filtering for unresolved triggers as general handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Triggers
        },
        user: () => generalHandler
      },
      {
        description:
          "Should return cases with resolved triggers when filtering for resolved triggers as a general handler",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Triggers
        },
        user: () => generalHandler
      },
      {
        description:
          "Should return cases with unresolved exceptions when filtering for unresolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Exceptions
        },
        user: () => generalHandler
      },
      {
        description:
          "Should return cases with resolved exceptions when filtering for resolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Exceptions
        },
        user: () => generalHandler
      },
      {
        description: "Should see no cases when filtering for resolved exceptions as a trigger handler",
        expectedCases: [],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Exceptions
        },
        user: () => triggerHandler
      },
      {
        description:
          "Should only see cases with unresolved triggers when filtering for unresolved exceptions as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Exceptions
        },
        user: () => triggerHandler
      },
      {
        description: "Should see no cases when filtering for resolved triggers as a exception handler",
        expectedCases: [],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Triggers
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should only see cases with unresolved exceptions when filtering for unresolved triggers as a exception handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Triggers
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should only see trigger that is resolved by themselves when searching a bails trigger code as a trigger handler",
        expectedCases: ["No exceptions/Bails Trigger Resolved by triggerHandler"],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [bailsTriggerCode]
        },
        user: () => triggerHandler
      },
      {
        description:
          "Should only see exception that is resolved by themselves when searching an exception code as an exception handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["HO100300"]
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should only see exception that has unresolved exception when searching a trigger code as an exception handler",
        expectedCases: ["Exceptions Unresolved/Trigger Unresolved", "Exceptions Unresolved/Bails Trigger Unresolved"],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All,
          reasonCodes: [dummyTriggerCode, bailsTriggerCode]
        },
        user: () => exceptionHandler
      },
      {
        description:
          "Should only see exception that has exception resolved by themselves when searching a trigger code as an exception handler",
        expectedCases: ["Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: ["TRPR0001"]
        },
        user: () => exceptionHandler
      },
      {
        description: "Should only see unresolved triggers when case state is not set as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => triggerHandler
      },
      {
        description: "Should only see unresolved exceptions when case state is not set as an exceptions handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => exceptionHandler
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a general handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => generalHandler
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a supervisor",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => supervisor
      }
    ]

    it.each(testCases)("$description", async ({ expectedCases, filters, user }) => {
      const result = (await fetchCasesAndFilter(
        helper.postgres.readonly,
        { ...filters, ...defaultQuery },
        user()
      )) as CaseIndexMetadata

      const cases = result.cases

      const defendantNames = sortBy(cases, "defendantName").map((c) => c.defendantName)
      const sortedExpectedCases = sortStringAsc(expectedCases)

      expect(defendantNames).toStrictEqual(sortedExpectedCases)
    })
  })
})
