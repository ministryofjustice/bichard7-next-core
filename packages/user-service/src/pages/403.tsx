import { GetServerSidePropsContext } from "next"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Head from "next/head"
import ContactLink from "components/ContactLink"
import Paragraph from "components/Paragraph"
import GridColumn from "components/GridColumn"

export const getServerSideProps = ({ res }: GetServerSidePropsContext) => {
  res.statusCode = 403
  return {
    props: {}
  }
}

const AccessDenied = () => (
  <>
    <Head>
      <title>{"Access denied"}</title>
    </Head>
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="govuk-heading-xl">{"Access denied"}</h1>

          <Paragraph>{"You do not have permission to access this page."}</Paragraph>
          <Paragraph>
            {"We suggest that you return to the "}
            <Link href="/">{"home page"}</Link>
            {" and choose an available service to you."}
          </Paragraph>
          <Paragraph>
            {"If you believe you have permission to access this page, you can "}
            <ContactLink>{"contact support"}</ContactLink>
            {" to report this issue."}
          </Paragraph>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default AccessDenied
