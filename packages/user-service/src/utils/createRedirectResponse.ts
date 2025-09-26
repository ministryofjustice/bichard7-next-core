import { GetServerSidePropsResult, Redirect } from "next"

export default <Props>(path: string, props?: Partial<Redirect>): GetServerSidePropsResult<Props> => {
  return {
    redirect: {
      destination: path,
      statusCode: 302,
      ...props
    }
  }
}
