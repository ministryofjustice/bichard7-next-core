const dateFormat = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?/

export default function toDate(element: unknown): Date | typeof element {
  if (typeof element === "string" && dateFormat.test(element)) {
    const potentialDate = new Date(element)
    if (isValidDate(potentialDate)) {
      return potentialDate
    }
  }

  return element
}

function isValidDate(date: unknown): boolean {
  return date != null && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date as number)
}
