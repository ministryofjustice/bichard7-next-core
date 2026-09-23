type AddLine = (
  text: string,
  condition?: boolean | (() => boolean),
  isSensitive?: boolean,
  anonymiseSensitiveText?: boolean
) => void

export default AddLine
