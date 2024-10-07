import { SingleExceptionWrapper } from "./SingleException.styles"

interface SingleExceptionProps {
  exception: string
  exceptionCounter: number
}

export const SingleException = ({ exception, exceptionCounter }: SingleExceptionProps) => (
  <SingleExceptionWrapper className="single-exception">
    {exception} <b>{exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
  </SingleExceptionWrapper>
)
