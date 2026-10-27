import fs from "node:fs"
import path from "node:path"

const REPO_ROOT = path.resolve(process.cwd())

/**
 * Ensures a target path strictly resides within the allowed base directory.
 */
function resolveSafePath(baseDir, relativeOrAbsolutePath) {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(resolvedBase, relativeOrAbsolutePath)

  // Ensure resolved path starts with base directory + delimiter
  if (resolvedTarget !== resolvedBase && !resolvedTarget.startsWith(resolvedBase + path.sep)) {
    throw new SecurityError(`Path traversal attempt detected: ${relativeOrAbsolutePath} escapes ${baseDir}`)
  }

  return resolvedTarget
}

class SecurityError extends Error {}

const safeArtifactsDir = resolveSafePath(REPO_ROOT, process.argv[2] || "test-timings")
const safeOutputFile = resolveSafePath(REPO_ROOT, process.argv[3] || "timings/timings.json")

// Use a null-prototype object to prevent prototype pollution
const masterTimings = Object.create(null)

// 1. Load existing timings baseline if present
if (fs.existsSync(safeOutputFile)) {
  try {
    const raw = fs.readFileSync(safeOutputFile, "utf8")
    const existing = JSON.parse(raw)
    if (typeof existing === "object" && existing !== null && !Array.isArray(existing)) {
      for (const [key, val] of Object.entries(existing)) {
        if (isValidTimingEntry(key, val)) {
          masterTimings[key] = val
        }
      }
    }
  } catch (err) {
    console.warn("Could not parse existing timings file, initializing fresh.")
  }
}

/**
 * Validates that spec keys are relative paths without traversal and values are positive numbers.
 */
function isValidTimingEntry(key, value) {
  if (typeof key !== "string" || typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return false
  }
  // Block prototype pollution tokens and path traversal inside JSON keys
  if (key === "__proto__" || key === "constructor" || key === "prototype" || key.includes("..")) {
    return false
  }
  return true
}

/**
 * Recursively inspects artifact directory without following symlinks.
 */
function mergeArtifacts(currentDir) {
  if (!fs.existsSync(currentDir)) return

  const entries = fs.readdirSync(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    // 1. Block symlinks explicitly to prevent escaping safeArtifactsDir
    if (entry.isSymbolicLink()) {
      console.warn(`Skipping symbolic link: ${path.join(currentDir, entry.name)}`)
      continue
    }

    const fullPath = resolveSafePath(safeArtifactsDir, path.join(currentDir, entry.name))

    if (entry.isDirectory()) {
      mergeArtifacts(fullPath)
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      try {
        const raw = fs.readFileSync(fullPath, "utf8")
        const data = JSON.parse(raw)

        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
          let count = 0
          for (const [key, val] of Object.entries(data)) {
            if (isValidTimingEntry(key, val)) {
              masterTimings[key] = Math.round(val)
              count++
            }
          }
          console.log(`Merged ${count} valid specs from: ${path.relative(REPO_ROOT, fullPath)}`)
        }
      } catch (err) {
        console.warn(`Failed reading/parsing ${fullPath}:`, err.message)
      }
    }
  }
}

// 2. Perform merge
mergeArtifacts(safeArtifactsDir)

// 3. Write safely to target destination
fs.mkdirSync(path.dirname(safeOutputFile), { recursive: true })
fs.writeFileSync(safeOutputFile, JSON.stringify(masterTimings, null, 2), "utf8")

console.log(
  `Successfully wrote ${Object.keys(masterTimings).length} spec timings to ${path.relative(REPO_ROOT, safeOutputFile)}`
)
