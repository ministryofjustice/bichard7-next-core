export type Content =
  | { outageType: string }
  | { maintenanceWindows: { date: string; startTime: string; endTime: string }[] }
  | { extendedTimeFrame: string }

export type Template = {
  templateFile: string
  templateTitle: string
}

export type User = {
  name: string
  email: string
  message: string
}[]

export const templateTypes: {
  PNCMAINTENANCE: Template
  EXTENDEDPNCMAINTENANCE: Template
  OUTAGE: Template
  OUTAGERESOLVED: Template
} = {
  PNCMAINTENANCE: {
    templateFile: "pnc-maintenance.txt",
    templateTitle: "Scheduled PNC Maintenance windows"
  },
  EXTENDEDPNCMAINTENANCE: {
    templateFile: "pnc-maintenance-extended.txt",
    templateTitle: "Unexpected PNC maintenance extended"
  },
  OUTAGE: {
    templateFile: "outage.txt",
    templateTitle: ""
  },
  OUTAGERESOLVED: {
    templateFile: "outage-resolved.txt",
    templateTitle: ""
  }
}
