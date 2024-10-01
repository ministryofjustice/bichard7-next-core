import type { Page } from "puppeteer"

export const retryDelay = async (
  condition: () => Promise<boolean>,
  retryFunction: () => Promise<void>,
  delay: number,
  attempts = 20
) => {
  let conditionMet = false
  let attemptsRemaining = attempts

  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms)
    })

  /* eslint-disable no-await-in-loop */
  while (!conditionMet && attemptsRemaining > 0) {
    conditionMet = await condition()
    if (!conditionMet) {
      attemptsRemaining -= 1
      await retryFunction()
      await wait(delay)
    }
  }

  return conditionMet
  /* eslint-enable no-await-in-loop */
}

export const reloadUntilSelector = (page: Page, selector: string, attempts?: number) => {
  const checkForSelector = async () => !!(await page.$(selector))

  const reloadPage = async () => {
    await page.reload()
  }

  return retryDelay(checkForSelector, reloadPage, 1000, attempts)
}

export const reloadUntilXPathSelector = (page: Page, selector: string, attempts?: number) => {
  const checkForSelector = async () => (await page.$$(selector)).length > 0

  const reloadPage = async () => {
    await page.reload()
  }

  return retryDelay(checkForSelector, reloadPage, 1000, attempts)
}

export const reloadUntilContent = (page: Page, content: string) => {
  const checkForContent = async () => !!(await page.evaluate(() => document.body.innerText)).includes(content)

  const reloadPage = async () => {
    await page.reload()
  }

  return retryDelay(checkForContent, reloadPage, 1000)
}

export const reloadUntilContentInSelector = (page: Page, content: string, selector: string, attempts = 20) => {
  const checkForContent = async () =>
    !!(await page.evaluate(
      (cont, sel) =>
        Array.from(document.querySelectorAll<HTMLElement>(sel))
          .map((s) => s.innerText)
          .some((el) => el.includes(cont)),
      content,
      selector
    ))

  const reloadPage = async () => {
    await page.reload()
  }

  return retryDelay(checkForContent, reloadPage, 1000, attempts)
}

export const reloadUntilNotContent = (page: Page, content: string) => {
  const checkForContent = async () => !(await page.evaluate(() => document.body.innerText)).includes(content)

  const reloadPage = async () => {
    await page.reload()
  }

  return retryDelay(checkForContent, reloadPage, 1000)
}

export const waitForRecord = async (page: Page, reloadAttempts?: number) => {
  await reloadUntilSelector(page, ".resultsTable a.br7_exception_list_record_table_link", reloadAttempts)
}

export const delay = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
