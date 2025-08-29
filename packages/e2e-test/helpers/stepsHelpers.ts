import {
  After as CucumberAfter,
  Before as CucumberBefore,
  Given as CucumberGiven,
  Then as CucumberThen,
  When as CucumberWhen
} from "@cucumber/cucumber"
import type Bichard from "../utils/world"

export const Given = CucumberGiven<Bichard>
export const When = CucumberWhen<Bichard>
export const Then = CucumberThen<Bichard>
export const Before = CucumberBefore<Bichard>
export const After = CucumberAfter<Bichard>
