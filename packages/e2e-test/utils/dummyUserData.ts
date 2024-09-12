type DummyUser = {
  inclusionList: string[]
  exclusionList: string[]
  visible_courts: string[]
  visible_forces: string[]
  excluded_triggers: string[]
  groups: string[]
}

// Note: These users are only created automatically when running against Postgres - they will need seeding in DB2 or LDAP
const dummyUsers: Record<string, DummyUser> = {
  supervisor: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  generalhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7GeneralHandler", "B7NewUI"]
  },
  triggerhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7TriggerHandler", "B7NewUI"]
  },
  exceptionhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7ExceptionHandler", "B7NewUI"]
  },
  auditor: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7Audit", "B7NewUI"]
  },
  "old.bichard.user": {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7GeneralHandler"]
  },
  "met.police": {
    inclusionList: ["001"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["001"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "wilt.shire": {
    inclusionList: ["054"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["054"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "super.fivefour": {
    inclusionList: ["054"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["054"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "br7.btp": {
    inclusionList: ["093"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["093"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "west.yorkshire": {
    inclusionList: [],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["013"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "essex.user": {
    inclusionList: ["042"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["042"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "norfolk.user": {
    inclusionList: ["036"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["036"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  },
  "trigger.fivefourexcl": {
    inclusionList: ["B01HO", "B01EF"],
    exclusionList: ["TRPR0003", "TRPR0004", "TRPR0006"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: [],
    excluded_triggers: ["TRPR0003", "TRPR0004", "TRPR0006"],
    groups: ["B7TriggerHandler", "B7NewUI"]
  },
  "general.handlerexclone": {
    inclusionList: ["B01HO", "B01EF"],
    exclusionList: ["TRPR0004", "TRPR0006"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: [],
    excluded_triggers: ["TRPR0004", "TRPR0006"],
    groups: ["B7GeneralHandler", "B7NewUI"]
  },
  "herts.user": {
    inclusionList: ["041"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["041"],
    excluded_triggers: [],
    groups: ["B7Supervisor", "B7NewUI"]
  }
}

export default dummyUsers
