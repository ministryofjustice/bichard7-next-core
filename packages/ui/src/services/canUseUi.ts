import { ALLOWED_FORCES_UI } from "config"

//need to get force from db?
export const canUseUi = (force: string): boolean => {
  return ALLOWED_FORCES_UI.includes(force)
}
