import type NavigationLocation from "./NavigationLocation"

type NavigationOptions = {
  args?: Record<string, unknown>
  location: NavigationLocation
}

type NavigationHandler = (options: NavigationOptions) => void

export { NavigationLocation }
export default NavigationHandler
