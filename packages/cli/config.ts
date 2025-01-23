export type Environment = {
  domain: string
  awsProfile: string
}

export const env: {
  E2E: Environment
  UAT: Environment
  PREPROD: Environment
  PROD: Environment
} = {
  E2E: {
    domain: "e2e-test.ptl.bichard7.modernisation-platform.service.justice.gov.uk",
    awsProfile: "bichard7-shared-e2e-test"
  },
  UAT: {
    domain: "uat.ptl.bichard7.modernisation-platform.service.justice.gov.uk",
    awsProfile: "bichard7-shared-uat"
  },
  PREPROD: {
    domain: "preprod.bichard7.service.justice.gov.uk",
    awsProfile: "qsolution-pre-prod"
  },
  PROD: {
    domain: "bichard7.service.justice.gov.uk",
    awsProfile: "qsolution-production"
  }
}
