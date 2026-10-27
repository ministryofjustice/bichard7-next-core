import fs from "node:fs"
import path from "node:path"

const artifactsDir = process.argv[2] || "test-timings"
const outputFile = process.argv[3] || "timings.json"

// 1. Start with existing timings if available (preserves specs not touched in this run)
let masterTimings = {}
if (fs.existsSync(outputFile)) {
  try {
    masterTimings = JSON.parse(fs.readFileSync(outputFile, "utf8"))
  } catch (err) {
    console.warn("Could not parse existing timings file, starting fresh.")
  }
}

// 2. Recursively find and merge all JSON files in the artifacts directory
function mergeArtifacts(dir) {
  if (!fs.existsSync(dir)) return

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      mergeArtifacts(fullPath)
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
        Object.assign(masterTimings, data)
        console.log(`Merged: ${fullPath} (${Object.keys(data).length} specs)`)
      } catch (err) {
        console.warn(`Failed reading ${fullPath}:`, err.message)
      }
    }
  }
}

mergeArtifacts(artifactsDir)

// 3. Ensure the destination folder exists and write the master file
fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(masterTimings, null, 2))

console.log(`Saved master timings (${Object.keys(masterTimings).length} total specs) to ${outputFile}`)
