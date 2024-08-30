import type { AppProps } from "next/app"
import { useEffect } from "react"
import "../../styles/globals.scss"

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (document.body.className.indexOf("js-enabled") < 0) {
      document.body.className +=
        " js-enabled" + ("noModule" in HTMLScriptElement.prototype ? " govuk-frontend-supported" : "")
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const GovUkFrontend = require("govuk-frontend")
    GovUkFrontend.initAll()
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
