import { FindOperator } from "typeorm"

const resolveFindOperator = <TInput, TOutput>(
  transformerInput: TInput | FindOperator<TInput>,
  transformedValue: (input: TInput) => TOutput
) => {
  if (transformerInput instanceof FindOperator) {
    return new FindOperator(
      transformerInput.type,
      transformedValue(transformerInput.value),
      transformerInput.useParameter,
      transformerInput.multipleParameters,
      transformerInput.getSql,
      transformerInput.objectLiteralParameters
    )
  }

  return transformedValue(transformerInput)
}

export default resolveFindOperator
