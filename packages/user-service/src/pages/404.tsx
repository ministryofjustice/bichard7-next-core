import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Paragraph from "components/Paragraph"
import useReturnToCaseListUrl from "hooks/useReturnToCaseListUrl"
import Head from "next/head"
import { useEffect, useState } from "react"

const Custom404 = () => {
  const [cookieSet, setCookieSet] = useState(false)
  const returnToCaseListUrl = useReturnToCaseListUrl()

  useEffect(() => {
    if (window.location.pathname.includes("/court-cases/")) {
      document.cookie = `qa_case_details_404=${window.location.pathname}; path=/`
      setCookieSet(true)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{"Page not found"}</title>
      </Head>
      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 data-test="404_header" className="govuk-heading-xl">
              {"Page not found"}
            </h1>

            <Paragraph>{"If you typed the web address, check it is correct."}</Paragraph>
            <Paragraph>{"If you pasted the web address, check you copied the entire address."}</Paragraph>
            <Paragraph>
              {"If the web address is correct or you selected a link or button, "}
              <ContactLink>{"contact support"}</ContactLink>
              {"."}
            </Paragraph>
            <a href={returnToCaseListUrl} className="govuk-button" data-module="govuk-button">
              {"Return to case list"}
            </a>
          </GridColumn>
        </GridRow>
        {cookieSet ? <div id={"cookie-set"} hidden aria-hidden></div> : undefined}
      </Layout>
    </>
  )
}

export default Custom404
