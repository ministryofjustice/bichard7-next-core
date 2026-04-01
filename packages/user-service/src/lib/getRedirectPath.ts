import type { ParsedUrlQuery } from "querystring"

export const isValidRedirectPath = (redirect: string): boolean => {
  const containsOnlyStandardChars = /^[a-z\/._-]+$/i.test(redirect)
  const isAbsoluteNonRootPath = /^\/.+/.test(redirect)
  return containsOnlyStandardChars && isAbsoluteNonRootPath
}

const getRedirectPath = ({ redirect }: ParsedUrlQuery, onlyAccessNewBichard?: boolean): string | undefined => {
  if (!!redirect && !Array.isArray(redirect) && isValidRedirectPath(redirect)) {
    if (onlyAccessNewBichard && redirect.startsWith("/bichard-ui")) {
      return "/bichard"
    }

    return redirect
  }

  return undefined
}

export default getRedirectPath
