/* eslint-disable @next/next/no-head-element */
import { ReactNode } from "react"

const outerBackgroundColour = "#f3f2f1"
const innerBackgroundColour = "#ffffff"
const borderColor = "#b1b4b6"
const color = "#0b0c0c"
const fontFamily = "Arial, sans-serif"

interface ChildProps {
  children: ReactNode
}

const Title = ({ children }: ChildProps) => (
  <h1 style={{ color, fontFamily, fontSize: "48px", lineHeight: "50px", marginBottom: "50px" }}>{children}</h1>
)

const Paragraph = ({ children }: ChildProps) => (
  <p style={{ color, fontFamily, fontSize: "19px", lineHeight: "25px", marginBottom: "20px" }}>{children}</p>
)

const CodeBox = ({ children }: ChildProps) => (
  <p style={{ color, fontFamily, fontSize: "40px", lineHeight: "25px", margin: "20px", fontWeight: "bold" }}>
    {children}
  </p>
)

interface EmailBaseProps {
  children: ReactNode
  title: string
}

const EmailBase = ({ children, title }: EmailBaseProps) => (
  <html lang="en">
    <head>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>{title}</title>
    </head>
    <body>
      <table style={{ backgroundColor: outerBackgroundColour, margin: "0", padding: "30px", width: "100%" }}>
        <tr />
        <tr>
          <td
            style={{
              backgroundColor: innerBackgroundColour,
              border: "1px solid",
              borderColor,
              clear: "both",
              display: "block !important",
              margin: "0 auto",
              maxWidth: "600px !important",
              padding: "30px",
              verticalAlign: "top"
            }}
            valign="top"
            width="600"
          >
            {children}
          </td>
        </tr>
        <tr />
      </table>
    </body>
  </html>
)

interface EmailLayoutProps {
  paragraphs: string[]
  title: string
  code: string
}

const EmailLayout = ({ paragraphs, title, code }: EmailLayoutProps) => (
  <EmailBase title={title}>
    <Title>{title}</Title>

    {paragraphs.map((paragraph, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Paragraph key={i}>{paragraph}</Paragraph>
    ))}
    <CodeBox>{code}</CodeBox>
    <Paragraph key="ignore">{"If you didn't request this email, you can safely ignore it."}</Paragraph>
  </EmailBase>
)

export default EmailLayout
