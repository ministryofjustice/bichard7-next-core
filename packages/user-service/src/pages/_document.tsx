import { addBasePath } from "next/dist/client/add-base-path"
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document"
import { JssProvider, SheetsRegistry, createGenerateId } from "react-jss"
import { ServerStyleSheet } from "styled-components"
import generateCsp from "utils/generateCsp"
import generateNonce from "utils/generateNonce"

const GovUkMetadata = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0b0c0c" />

    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link rel="shortcut icon" sizes="16x16 32x32 48x48" href={addBasePath("/images/favicon.ico")} type="image/x-icon" />
    <link rel="mask-icon" href={addBasePath("/images/govuk-mask-icon.svg")} color="#0b0c0c" />
    <link rel="apple-touch-icon" sizes="180x180" href={addBasePath("/images/govuk-apple-touch-icon-180x180.png")} />
    <link rel="apple-touch-icon" sizes="167x167" href={addBasePath("/images/govuk-apple-touch-icon-167x167.png")} />
    <link rel="apple-touch-icon" sizes="152x152" href={addBasePath("/images/govuk-apple-touch-icon-152x152.png")} />
    <link rel="apple-touch-icon" href={addBasePath("/images/govuk-apple-touch-icon.png")} />

    <meta property="og:image" content={addBasePath("/images/govuk-opengraph-image.png")} />
  </>
)

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

    // react-jss
    const registry = new SheetsRegistry()
    const generateId = createGenerateId()

    // include styles from both styled-components and react-jss
    try {
      ctx.renderPage = () => {
        return originalRenderPage({
          enhanceApp: (App) => (props) => (
            <JssProvider registry={registry} generateId={generateId}>
              {sheet.collectStyles(<App {...props} />)}
            </JssProvider>
          )
        })
      }

      const initialProps = await Document.getInitialProps(ctx)
      const additionalProps = {
        nonce,
        styles: [
          initialProps.styles,
          sheet.getStyleElement(),
          <style key="react-jss" id="server-side-styles-react-jss">
            {registry.toString()}
          </style>
        ]
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
          <meta property="csp-nonce" content={nonce} />
          <GovUkMetadata />
        </Head>

        <body className="govuk-template__body">
          <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">
            {"Skip to main content"}
          </a>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default GovUkDocument
