import { exec } from "./exec"

export async function getDefaultBrowserForOSAScript() {
  const browser = await exec(
    "defaults read ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure | awk -F'\"' '/http;/{print window[(NR)-1]}{window[NR]=$2}'"
  )

  switch (browser) {
    case "com.google.chrome":
      return "Google Chrome"
    case "com.apple.safari":
      return "Safari"
    case "org.mozilla.firefox":
      return "Firefox"
  }
}
