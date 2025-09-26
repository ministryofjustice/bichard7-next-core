/* eslint-disable @next/next/no-head-element */
import { ReactNode } from "react"

const outerBackgroundColour = "#f3f2f1"
const innerBackgroundColour = "#ffffff"
const borderColor = "#b1b4b6"
const buttonColor = "#00703c"
const color = "#0b0c0c"
const dimColor = "#505a5f"
const fontFamily = "Arial, sans-serif"

const dimStyles = { color: dimColor, fontFamily, fontSize: "14px", lineHeight: "16px", marginBottom: "16px" }

interface ChildProps {
  children: ReactNode
}

const Title = ({ children }: ChildProps) => (
  <h1 style={{ color, fontFamily, fontSize: "48px", lineHeight: "50px", marginBottom: "50px" }}>{children}</h1>
)

const Paragraph = ({ children }: ChildProps) => (
  <p style={{ color, fontFamily, fontSize: "19px", lineHeight: "25px", marginBottom: "20px" }}>{children}</p>
)

interface ButtonProps {
  href: string
  label: string
}

const Button = ({ href, label }: ButtonProps) => (
  <a
    href={href}
    style={{
      backgroundColor: buttonColor,
      color: "#ffffff",
      cursor: "pointer",
      display: "inline-block",
      fontFamily,
      fontSize: "19px",
      lineHeight: "19px",
      padding: "8px 10px 7px 10px",
      textAlign: "center",
      textDecoration: "none"
    }}
  >
    {label}
  </a>
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
  actionUrl?: string
  buttonLabel?: string
  paragraphs: string[]
  title: string
}

const EmailLayout = ({ actionUrl, buttonLabel, paragraphs, title }: EmailLayoutProps) => (
  <EmailBase title={title}>
    <Title>{title}</Title>

    {paragraphs.map((paragraph, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Paragraph key={i}>{paragraph}</Paragraph>
    ))}

    {!!actionUrl && !!buttonLabel && (
      <>
        <Button href={actionUrl} label={buttonLabel} />

        <p style={{ ...dimStyles, marginTop: "50px" }}>
          {"If you’re having trouble clicking the button, copy and paste the URL below into your web browser:"}
        </p>
        <p style={{ ...dimStyles, margin: "0" }}>
          <a href={actionUrl} style={dimStyles}>
            {actionUrl}
          </a>
        </p>
      </>
    )}
  </EmailBase>
)

export default EmailLayout
