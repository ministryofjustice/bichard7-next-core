type DummyUser = {
  excluded_triggers: string[]
  exclusionList: string[]
  groups: string[]
  inclusionList: string[]
  visible_courts: string[]
  visible_forces: string[]
}

// Note: These users are only created automatically when running against Postgres - they will need seeding in DB2 or LDAP
const dummyUsers: Record<string, DummyUser> = {
  auditor: {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Audit", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "br7.btp": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["093"],
    visible_courts: [],
    visible_forces: ["093"]
  },
  "essex.user": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["042"],
    visible_courts: [],
    visible_forces: ["042"]
  },
  exceptionhandler: {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7ExceptionHandler", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "general.handlerexclone": {
    excluded_triggers: ["TRPR0004", "TRPR0006"],
    exclusionList: ["TRPR0004", "TRPR0006"],
    groups: ["B7GeneralHandler", "B7NewUI"],
    inclusionList: ["B01HO", "B01EF"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: []
  },
  generalhandler: {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7GeneralHandler", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "herts.user": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["041"],
    visible_courts: [],
    visible_forces: ["041"]
  },
  "met.police": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["001"],
    visible_courts: [],
    visible_forces: ["001"]
  },
  "norfolk.user": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["036"],
    visible_courts: [],
    visible_forces: ["036"]
  },
  "old.bichard.user": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7GeneralHandler"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "super.fivefour": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["054"],
    visible_courts: [],
    visible_forces: ["054"]
  },
  supervisor: {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  supervisorwithexcludedtrpr0006: {
    excluded_triggers: ["TRPR0006"],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "trigger.fivefourexcl": {
    excluded_triggers: ["TRPR0003", "TRPR0004", "TRPR0006"],
    exclusionList: ["TRPR0003", "TRPR0004", "TRPR0006"],
    groups: ["B7TriggerHandler", "B7NewUI"],
    inclusionList: ["B01HO", "B01EF"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: []
  },
  triggerhandler: {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7TriggerHandler", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  triggerhandlerwithexcludedtrpr0006: {
    excluded_triggers: ["TRPR0006"],
    exclusionList: [],
    groups: ["B7TriggerHandler", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  triggerhandlerwithexcludedtrpr0008: {
    excluded_triggers: ["TRPR0008"],
    exclusionList: [],
    groups: ["B7TriggerHandler", "B7NewUI"],
    inclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"]
  },
  "west.yorkshire": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: [],
    visible_courts: [],
    visible_forces: ["013"]
  },
  "wilt.shire": {
    excluded_triggers: [],
    exclusionList: [],
    groups: ["B7Supervisor", "B7NewUI"],
    inclusionList: ["054"],
    visible_courts: [],
    visible_forces: ["054"]
  }
}

export default dummyUsers
