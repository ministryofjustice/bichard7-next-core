const normaliseForce = (f: string) => f.trim().padStart(3, "0")

export const formatForceEnvVariable = (envVar: string): Set<string> => {
  return new Set(
    envVar
      .split(",")
      .filter((f) => f.trim() !== "")
      .map(normaliseForce)
  )
}

export const forcesWithEnvVariable = (envVar: Set<string>, forces: string[]): boolean => {
  if (envVar.size === 0) {
    return false
  }

  return forces.some((force) => envVar.has(normaliseForce(force)))
}
