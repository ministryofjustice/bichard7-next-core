import { AppProps } from "next/app"
import { useEffect } from "react"
import "../styles/globals.scss"

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (document.body.className.indexOf("js-enabled") < 0) {
      document.body.className +=
        " js-enabled" + ("noModule" in HTMLScriptElement.prototype ? " govuk-frontend-supported" : "")
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const GovUkFrontend = require("govuk-frontend")
    GovUkFrontend.initAll()
  }, [])

  return <Component {...pageProps} />
}

export default App
