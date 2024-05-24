export default (time: string): string => {
  if (!time) {
    return time
  }

  const match = time.match(/^(\d{2}):(\d{2})/)
  if (match) {
    return `${match[1]}:${match[2]}`
  }

  return time
}
