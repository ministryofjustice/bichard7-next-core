import Layout from "components/Layout"
import Paragraph from "components/Paragraph"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import useCustomStyles from "styles/useCustomStyles"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import User from "types/User"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext

    return {
      props: {
        currentUser
      }
    }
  }
)

interface Props {
  currentUser?: Partial<User>
}

const ShareFeedback = ({ currentUser }: Props) => {
  const classes = useCustomStyles()
  return (
    <>
      <Head>
        <title>{"Thank you for your feedback"}</title>
      </Head>
      <Layout user={currentUser} showPhaseBanner={false}>
        <div className={`${classes["top-padding"]}`}>
          <h3 className="govuk-heading-xl">{"Thank you for your feedback "}</h3>
          <Paragraph>{"Your feedback helps us make improvements to Bichard7."}</Paragraph>
          <Paragraph>{"You can now close this window."}</Paragraph>
        </div>
      </Layout>
    </>
  )
}

export default ShareFeedback
