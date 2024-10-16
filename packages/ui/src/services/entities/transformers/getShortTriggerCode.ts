const getShortTriggerCode = (triggerCode: string | null) => {
  if (!triggerCode) {
    return null
  }

  const triggerType = triggerCode?.substring(2, 4)
  if (!triggerType) {
    return triggerCode
  }

  const triggerNumber = parseInt(triggerCode.substring(4), 10)
  if (isNaN(triggerNumber)) {
    return triggerCode
  }

  const triggerNumberString = triggerNumber.toString().padStart(2, "0")
  return `${triggerType}${triggerNumberString}`
}

export default getShortTriggerCode
