const getLongTriggerCode = (triggerCode?: string | null): string | null => {
  if (!triggerCode) {
    return null
  }

  triggerCode = triggerCode.toUpperCase()

  const triggerType = triggerCode?.substring(0, 2)
  if (triggerType[0] !== "P") {
    return triggerCode
  }

  const triggerNumber = parseInt(triggerCode.substring(2), 10)
  if (isNaN(triggerNumber)) {
    return triggerCode
  }

  const triggerNumberString = triggerNumber.toString().padStart(4, "0")
  return `TR${triggerType}${triggerNumberString}`
}

export default getLongTriggerCode
