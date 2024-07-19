const toArray = <T>(element: unknown): T[] =>
  element === undefined ? [] : !Array.isArray(element) ? [element] : element

export default toArray
