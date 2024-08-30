import { GetServerSidePropsResult } from "next/types"

const notSuccessful = <TProps>(message: string) =>
  ({
    isSuccessful: false,
    ValidationException: message
  }) as unknown as GetServerSidePropsResult<TProps>

export default notSuccessful
