import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"
import Link from "components/Link"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"

const Success = () => (
  <>
    <Head>
      <title>{"Password Changed"}</title>
    </Head>
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <BackLink href="/" />

          <SuccessBanner>
            {`You can now `}
            <Link href="/">{`sign in with your new password`}</Link>
            {`.`}
          </SuccessBanner>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default Success
