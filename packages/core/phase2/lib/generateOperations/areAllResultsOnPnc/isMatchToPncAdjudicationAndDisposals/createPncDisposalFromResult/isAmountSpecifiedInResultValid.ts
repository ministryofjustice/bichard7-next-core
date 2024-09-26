const isAmountSpecifiedInResultValid = (amount?: number): boolean => {
  if (amount === undefined) {
    return false
  }

  const amountStr = amount.toString()
  if (amountStr.split(".")[0].length > 7 || amountStr.length > 10) {
    return false
  }

  return true
}

export default isAmountSpecifiedInResultValid
