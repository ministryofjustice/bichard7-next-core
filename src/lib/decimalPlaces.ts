const decimalPlaces = (input: string): number => {
  const splitInput = input.split(".")
  if (splitInput.length > 1) {
    return splitInput[1].length
  }
  return 0
}

export default decimalPlaces
