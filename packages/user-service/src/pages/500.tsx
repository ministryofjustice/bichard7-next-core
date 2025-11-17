import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import useReturnToCaseListUrl from "hooks/useReturnToCaseListUrl"
import Head from "next/head"
import { useEffect, useState } from "react"

const handleBack = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault()
  window.history.back()
}

const formatEmail = (errorId?: string): string => {
  const emailSubject = "Feedback: 500 Error"
  let emailBody =
    "Please describe the issues you have experienced, including Username and Force - the more detail the better. If you have any screenshots, please attach them to the email."

  if (errorId) {
    emailBody = `Error List ID: ${errorId}\n\n${emailBody}`
  }

  return `mailto:moj-bichard7@madetech.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
}

const Custom500 = () => {
  const returnToCaseListUrl = useReturnToCaseListUrl()
  const [errorId, setErrorId] = useState<string | undefined>(undefined)

  const emailLink = formatEmail(errorId)

  useEffect(() => {
    if (window.location.pathname.includes("/court-cases/")) {
      const result = /court-cases\/(\d+)/.exec(window.location.pathname)

      if (result) {
        setErrorId(result[1])
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>{"Sorry, there is a problem with Bichard"}</title>
      </Head>
      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="govuk-heading-xl">{"Sorry, there is a problem with Bichard"}</h1>

            <Paragraph>{"Please try the following"}</Paragraph>
            <ol>
              <li>
                <Link href="#" onClick={handleBack}>
                  {"Click here to try the previous page again"}
                </Link>
              </li>
              <li>
                <Link href="/">{"Click here to go to the main login page"}</Link>
              </li>
            </ol>
            <Paragraph>
              <ContactLink>{"Contact support"}</ContactLink>
              {" if you have repeated problems with Bichard."}
            </Paragraph>
            <a
              href={returnToCaseListUrl}
              className="govuk-button"
              data-module="govuk-button"
              style={{ marginRight: "1rem" }}
            >
              {"Return to case list"}
            </a>
            <a href={emailLink} className="govuk-button" data-module="govuk-button">
              {"Report this error"}
            </a>
          </GridColumn>
        </GridRow>
      </Layout>
    </>
  )
}

export default Custom500
