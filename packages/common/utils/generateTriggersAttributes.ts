export const generateTriggersAttributes = (
  triggers: { triggerCode: string; triggerItemIdentity: number | undefined }[]
) =>
  triggers.reduce((acc: Record<string, unknown>, trigger, index) => {
    const offenceNumberText =
      trigger.triggerItemIdentity && trigger.triggerItemIdentity > 0 ? ` (${trigger.triggerItemIdentity})` : ""
    acc[`Trigger ${index + 1} Details`] = `${trigger.triggerCode}${offenceNumberText}`
    return acc
  }, {})
