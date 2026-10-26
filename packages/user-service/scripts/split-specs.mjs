import fs from "node:fs"
import path from "node:path"

const targetDir = process.argv[2] || "cypress/e2e"
const totalBuckets = parseInt(process.env.SPLIT_TOTAL || "1", 10)
const bucketIndex = parseInt(process.env.SPLIT_INDEX || "0", 10)
const timingsPath = process.env.TIMINGS_FILE || "timings.json"

// Recursively find all spec files
function getFiles(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath))
    } else if (/\.cy\.(jsx?|tsx?)$/.test(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

const specs = getFiles(targetDir)

// Read previous timings (format: { "path/to/spec.cy.js": durationInSeconds })
let timings = {}
if (fs.existsSync(timingsPath)) {
  try {
    timings = JSON.parse(fs.readFileSync(timingsPath, "utf8"))
  } catch {
    // Fall back to empty timings if file is malformed
  }
}

// Sort specs from longest running to shortest (fallback: 10s default)
specs.sort((a, b) => (timings[b] || 10) - (timings[a] || 10))

// Greedy bin-packing: assign each spec to the runner with the lowest cumulative duration
const buckets = Array.from({ length: totalBuckets }, () => ({ duration: 0, specs: [] }))
for (const spec of specs) {
  buckets.sort((a, b) => a.duration - b.duration)
  const cost = timings[spec] || 10
  buckets[0].specs.push(spec)
  buckets[0].duration += cost
}

// Print comma-separated specs to stdout for this runner
const runnerSpecs = buckets[bucketIndex] ? buckets[bucketIndex].specs : []
process.stdout.write(runnerSpecs.join(","))
