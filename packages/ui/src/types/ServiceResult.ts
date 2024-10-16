interface ServiceResult {
  isSuccessful: boolean
  ValidationException?: string
  Exception?: Error
}

type ServiceResultPromise = Promise<ServiceResult>

export type { ServiceResultPromise, ServiceResult }
