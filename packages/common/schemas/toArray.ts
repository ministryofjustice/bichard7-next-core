const toArray = <T>(element: T | T[]): T[] =>
  element === undefined || element === null ? [] : !Array.isArray(element) ? [element] : element

export default toArray
