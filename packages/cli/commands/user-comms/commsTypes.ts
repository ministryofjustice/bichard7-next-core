export type Templates = {
  template: {
    templateFile: string
  }
}

export const commsTemplates: {
  PNCMAINTENACE: Templates
  EXTENDEDPNCMAINTENACE: Templates
  OUTAGE: Templates
  OUTAGERESOLVED: Templates
} = {
  PNCMAINTENACE: {
    template: {
      templateFile: "pnc-maintenance.txt"
    }
  },
  EXTENDEDPNCMAINTENACE: {
    template: {
      templateFile: "pnc-maintenance-extended.txt"
    }
  },
  OUTAGE: {
    template: {
      templateFile: "outage.txt"
    }
  },
  OUTAGERESOLVED: {
    template: {
      templateFile: "outage-resolved.txt"
    }
  }
}
