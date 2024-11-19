interface ServiceResult {
  Exception?: Error
  isSuccessful: boolean
  ValidationException?: string
}

type ServiceResultPromise = Promise<ServiceResult>

export type { ServiceResult, ServiceResultPromise }
