import type { GetServerSideProps } from "next"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithServerSidePropsItem<Props extends { [key: string]: any }> = (
  item: GetServerSideProps<Props>
) => GetServerSideProps<Props>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withMultipleServerSideProps = <Props extends { [key: string]: any }>(
  ...serverSideProps: (GetServerSideProps<Props> | WithServerSidePropsItem<Props>)[]
): GetServerSideProps<Props> => {
  const items = serverSideProps.reverse()
  let result = items.shift() as GetServerSideProps<Props>
  for (const item of items) {
    result = (item as WithServerSidePropsItem<Props>)(result)
  }

  return result
}

export default withMultipleServerSideProps
