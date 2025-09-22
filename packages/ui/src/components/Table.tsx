import type { ComponentProps } from "react"
import { mergeClassNames } from "../helpers/mergeClassNames"

export const Table = ({ className, children, ...props }: ComponentProps<"table">) => {
  return (
    <table {...props} className={mergeClassNames("govuk-table", className)}>
      {children}
    </table>
  )
}

export const TableHead = ({ className, children, ...props }: ComponentProps<"thead">) => {
  return (
    <thead {...props} className={mergeClassNames("govuk-table__head", className)}>
      {children}
    </thead>
  )
}

export const TableBody = ({ className, children, ...props }: ComponentProps<"tbody">) => {
  return (
    <tbody {...props} className={mergeClassNames("govuk-table__body", className)}>
      {children}
    </tbody>
  )
}

export const TableRow = ({ className, children, ...props }: ComponentProps<"tr">) => {
  return (
    <tr {...props} className={mergeClassNames("govuk-table__row", className)}>
      {children}
    </tr>
  )
}

export const TableHeader = ({ className, children, ...props }: ComponentProps<"th">) => {
  return (
    <th {...props} className={mergeClassNames("govuk-table__header", className)}>
      {children}
    </th>
  )
}

export const TableCell = ({ className, children, ...props }: ComponentProps<"td">) => {
  return (
    <td {...props} className={mergeClassNames("govuk-table__cell", className)}>
      {children}
    </td>
  )
}
