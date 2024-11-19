import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"
import generateCsp from "utils/generateCsp"
import generateNonce from "utils/generateNonce"

import { basePath } from "../../next.config"

const GovUkMetadata = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      <meta content="#0b0c0c" name="theme-color" />

      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

      <link
        href={`${basePath}/govuk_assets/images/favicon.ico`}
        rel="shortcut icon"
        sizes="16x16 32x32 48x48"
        type="image/x-icon"
      />
      <link color="#0b0c0c" href={`${basePath}/govuk_assets/images/govuk-mask-icon.svg`} rel="mask-icon" />
      <link
        href={`${basePath}/govuk_assets/images/govuk-apple-touch-icon-180x180.png`}
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href={`${basePath}/govuk_assets/images/govuk-apple-touch-icon-167x167.png`}
        rel="apple-touch-icon"
        sizes="167x167"
      />
      <link
        href={`${basePath}/govuk_assets/images/govuk-apple-touch-icon-152x152.png`}
        rel="apple-touch-icon"
        sizes="152x152"
      />
      <link href={`${basePath}/govuk_assets/images/govuk-apple-touch-icon.png`} rel="apple-touch-icon" />

      <meta content={`${basePath}/govuk_assets/images/govuk-opengraph-image.png`} property="og:image" />
    </>
  )
}

interface DocumentProps {
  nonce: string
}

class GovUkDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const nonce = generateNonce()
    ctx.res?.setHeader("Content-Security-Policy", generateCsp(nonce))

    // styled-components
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    // include styles from both styled-components
    try {
      ctx.renderPage = () => {
        return originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        })
      }

      const initialProps = await Document.getInitialProps(ctx)
      const additionalProps = {
        nonce,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }

      return {
        ...initialProps,
        ...additionalProps
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const { nonce } = this.props

    return (
      <Html className="govuk-template" lang="en">
        <Head>
          <meta content={nonce} property="csp-nonce" />
          <GovUkMetadata />
        </Head>

        <body className="govuk-template__body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default GovUkDocument
