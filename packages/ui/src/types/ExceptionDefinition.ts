export type ExceptionDefinition = {
  code: string
  description: string
  shortDescription: string
  cause: string
  correctingThisError: string
  avoidingThisError: string
  details?: Omit<ExceptionDefinition, "details" | "code">[]
}
