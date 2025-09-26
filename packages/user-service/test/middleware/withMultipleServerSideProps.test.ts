import { withMultipleServerSideProps } from "middleware"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import KeyValuePair from "types/KeyValuePair"

let functionInvokeLog: KeyValuePair<string, unknown> = {}
let functionInvokeIndex = 0

const createServerSidePropsFunction = (functionName: string) => {
  return <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
    const result: GetServerSideProps<Props> = (
      context: GetServerSidePropsContext<ParsedUrlQuery>
    ): Promise<GetServerSidePropsResult<Props>> => {
      functionInvokeLog[functionName] = ++functionInvokeIndex
      return getServerSidePropsFunction(context)
    }

    return result
  }
}

it("should invoke functions in order", async () => {
  functionInvokeIndex = 0
  functionInvokeLog = {}
  const serverSidePropsFunction1 = createServerSidePropsFunction("Func1")
  const serverSidePropsFunction2 = createServerSidePropsFunction("Func2")
  const serverSidePropsFunction3 = createServerSidePropsFunction("Func3")
  const serverSidePropsFunction4: GetServerSideProps = <Props>(): Promise<GetServerSidePropsResult<Props>> => {
    functionInvokeLog.Func4 = ++functionInvokeIndex
    return Promise.resolve({ props: {} as Props })
  }

  const context = {} as unknown as GetServerSidePropsContext<ParsedUrlQuery>
  const getServerSideProps = withMultipleServerSideProps(
    serverSidePropsFunction1,
    serverSidePropsFunction2,
    serverSidePropsFunction3,
    serverSidePropsFunction4
  )
  await getServerSideProps(context)

  expect(Object.keys(functionInvokeLog)).toHaveLength(4)
  expect(functionInvokeLog.Func1).toBe(1)
  expect(functionInvokeLog.Func2).toBe(2)
  expect(functionInvokeLog.Func3).toBe(3)
  expect(functionInvokeLog.Func4).toBe(4)
})
