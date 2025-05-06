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
  PNC_MAINTENANCE: Template
  EXTENDED_PNC_MAINTENANCE: Template
  OUTAGE: Template
  OUTAGE_RESOLVED: Template
} = {
  PNC_MAINTENANCE: {
    templateFile: "pnc-maintenance.txt",
    templateTitle: "Scheduled PNC Maintenance windows"
  },
  EXTENDED_PNC_MAINTENANCE: {
    templateFile: "pnc-maintenance-extended.txt",
    templateTitle: "Unexpected PNC maintenance extended"
  },
  OUTAGE: {
    templateFile: "outage.txt",
    templateTitle: ""
  },
  OUTAGE_RESOLVED: {
    templateFile: "outage-resolved.txt",
    templateTitle: ""
  }
}
