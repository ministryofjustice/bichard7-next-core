import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import getConnection from "lib/getConnection"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { signOutUser } from "useCases"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
    const { req, res } = context as AuthenticationServerSidePropsContext
    const connection = getConnection()
    await signOutUser(connection, res, req)
    return { props: {} }
  }
)

const Index = () => (
  <>
    <Head>
      <title>{"Signed out of Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="govuk-heading-xl">{"Signed out of Bichard 7"}</h1>

          <Paragraph>{"You have been signed out of your account."}</Paragraph>
          <Paragraph>
            {"In order to sign back in, please click "}
            <Link href="/login" data-test="log-back-in">
              {"here"}
            </Link>
            {"."}
          </Paragraph>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default Index
