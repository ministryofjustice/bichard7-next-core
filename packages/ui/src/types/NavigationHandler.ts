import type NavigationLocation from "./NavigationLocation"

type NavigationOptions = {
  location: NavigationLocation
  args?: Record<string, unknown>
}

type NavigationHandler = (options: NavigationOptions) => void

export { NavigationLocation }
export default NavigationHandler
