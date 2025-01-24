export type Environment = {
  domain: string
  aws: {
    profile: string
    account: string
  }
}

export const env: {
  E2E: Environment
  UAT: Environment
  PREPROD: Environment
  PROD: Environment
  SHARED: Environment
} = {
  E2E: {
    domain: "e2e-test.ptl.bichard7.modernisation-platform.service.justice.gov.uk",
    aws: {
      profile: "bichard7-shared-e2e-test",
      account: "bichard-7-e2e-test"
    }
  },
  UAT: {
    domain: "uat.ptl.bichard7.modernisation-platform.service.justice.gov.uk",
    aws: {
      profile: "bichard7-shared-uat",
      account: "bichard-7-uat"
    }
  },
  PREPROD: {
    domain: "preprod.bichard7.service.justice.gov.uk",
    aws: {
      profile: "qsolution-pre-prod",
      account: "bichard-7-preprod"
    }
  },
  PROD: {
    domain: "bichard7.service.justice.gov.uk",
    aws: {
      profile: "qsolution-production",
      account: "bichard-7-production"
    }
  },
  SHARED: {
    domain: "bichard7.service.justice.gov.uk",
    aws: {
      profile: "bichard7-shared",
      account: "bichard7-shared"
    }
  }
}
