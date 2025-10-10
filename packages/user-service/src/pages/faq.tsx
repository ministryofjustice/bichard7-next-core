import Accordion from "components/Accordion"
import AccordionItem from "components/AccordionItem"
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
import faqJSON from "../faqs.json"

interface faqJson {
  lastUpdated: string
  faqs: Array<faqElement>
}

interface faqElement {
  id: string
  question: string
  answer: string
}

interface Props {
  faqJson: faqJson
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
      faqJson: faqJSON,
      serviceMessages
    }
  }
}

const faq = ({ faqJson, serviceMessages }: Props) => {
  return (
    <>
      <Head>
        <title>{"FAQ"}</title>
      </Head>

      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 data-test="faq_heading" className="govuk-heading-xl">
              {"Frequently Asked Questions"}
            </h1>

            <Paragraph>
              {
                "Before contacting support, please check to see if your query is already answered by the information below."
              }
            </Paragraph>

            <Accordion>
              {faqJson.faqs.map((faqItem) => (
                <AccordionItem heading={faqItem.question} id={faqItem.id} key={faqItem.id} dataTest="faq-item">
                  <Paragraph>{faqItem.answer}</Paragraph>
                </AccordionItem>
              ))}
            </Accordion>

            <h3 className="govuk-heading-m">{"Still need help?"}</h3>
            <Paragraph>
              {"If your query isn't answered by the above information, then you can "}
              <Link href={`mailto:${config.supportEmail}`}>{"contact the Bichard team for support"}</Link>
              {"."}
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

export default faq
