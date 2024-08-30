import type { IncomingMessage, ServerResponse } from "http"
import type { GetServerSidePropsResult } from "next/types"

const forbidden = <TProps>(res: ServerResponse<IncomingMessage>, message = "Forbidden") => {
  res.statusCode = 403
  res.statusMessage = message
  res.end()
  return { props: {} } as unknown as GetServerSidePropsResult<TProps>
}

export default forbidden
