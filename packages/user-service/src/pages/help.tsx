import BulletList from "components/BulletList"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import ServiceMessages from "components/ServiceMessages"
import config from "lib/config"
import getConnection from "lib/getConnection"
import Head from "next/head"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import getServiceMessages from "useCases/getServiceMessages"
import logger from "utils/logger"

interface Props {
  serviceMessages: ServiceMessage[]
}

export const getServerSideProps = async () => {
  const connection = getConnection()
  const serviceMessagesResult = await getServiceMessages(connection, 0)
  let serviceMessages: ServiceMessage[] = []
  if (isError(serviceMessagesResult)) {
    logger.error(serviceMessagesResult)
  } else {
    serviceMessages = JSON.parse(JSON.stringify(serviceMessagesResult.result))
  }
  return {
    props: {
      serviceMessages
    }
  }
}

const help = ({ serviceMessages }: Props) => {
  return (
    <>
      <Head>
        <title>{"Help"}</title>
      </Head>

      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 data-test="help_heading" className="govuk-heading-xl">
              {"Help"}
            </h1>
            <h2 data-test="help_sub_heading_1" className="govuk-heading-m">
              {"Problems with your account"}
            </h2>
            <BulletList
              heading="The member of your team responsible for managing Bichard7 accounts can help you with:"
              items={[
                "checking and changing the email address registered to your account",
                "viewing and updating permissions on your account",
                "setting up new user accounts",
                "deleting user accounts"
              ]}
            />
            <Paragraph>
              {"If you have forgotten your password or need to update it, follow the on-screen instructions to "}
              <Link href="/login/reset-password" data-test="reset-password">
                {"change your password"}
              </Link>
              {"."}
            </Paragraph>

            <h2 data-test="help_sub_heading_2" className="govuk-heading-m">
              {"Report something not working"}
            </h2>
            <Paragraph>
              {"To report something not working, contact the "}
              <Link href={`mailto:${config.supportEmail}`}>{"Bichard7 support desk (opens in new tab)"}</Link>
              {"."}
            </Paragraph>
            <Paragraph>
              {
                "The support desk may contact you to resolve the problem or ask for more information about the problem. You will be contacted within 5 working days."
              }
            </Paragraph>
          </GridColumn>
          <GridColumn width="one-third">
            <h2 className="govuk-heading-m">{"Latest service messages"}</h2>
            <ServiceMessages messages={serviceMessages} />
          </GridColumn>
        </GridRow>
      </Layout>
    </>
  )
}

export default help
