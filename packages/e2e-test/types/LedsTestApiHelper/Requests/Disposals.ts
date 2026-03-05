type LinkedOffence = {
  offenceId: string
  versionToChange: string
}

export type Court =
  | {
      courtIdentityType: "code"
      courtCode: string
    }
  | {
      courtIdentityType: "name"
      courtName: string
    }

type Disposal = {
  forceStationInCase: string
  convictionDate: string
  court: Court
  caseStatusMarker: "impending-prosecution-detail"
}

type Disposals = {
  fsCodeMakingChange: string
  checkname: string
  content: {
    linkedOffences: LinkedOffence[]
    disposal: Disposal
  }
}

export default Disposals
