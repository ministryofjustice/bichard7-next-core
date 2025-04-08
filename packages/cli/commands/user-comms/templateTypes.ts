export type Content =
  | { outageType: string }
  | { maintenanceWindows: { date: string; startTime: string; endTime: string }[] }
  | { extendedTimeFrame: string }

export type Templates = {
  template: {
    templateFile: string
  }
}

export const templateTypes: {
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
