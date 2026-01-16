export const hashToRatio = (input: string): number => {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.codePointAt(i)

    if (char !== undefined) {
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
  }

  return Math.abs(hash % 10000) / 10000
}

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}
