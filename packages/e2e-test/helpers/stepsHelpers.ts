import {
  After as CucumberAfter,
  Before as CucumberBefore,
  Given as CucumberGiven,
  Then as CucumberThen,
  When as CucumberWhen
} from "@cucumber/cucumber"
import type Bichard from "../utils/world"

export const Given: typeof CucumberGiven<Bichard> = CucumberGiven<Bichard>
export const When: typeof CucumberWhen<Bichard> = CucumberWhen<Bichard>
export const Then: typeof CucumberThen<Bichard> = CucumberThen<Bichard>
export const Before: typeof CucumberBefore<Bichard> = CucumberBefore<Bichard>
export const After: typeof CucumberAfter<Bichard> = CucumberAfter<Bichard>
