type Segment = {
  name: string
  value: string
}

const extractSegments = (xml: string): Segment[] => {
  const regex = new RegExp(/<(?<name>[A-Z]{3})>(?<value>.*?)<\/[A-Z]{3}>/g)

  const segments: { name: string; value: string }[] = []
  while (true) {
    const result = regex.exec(xml)?.groups
    if (!result) {
      break
    }

    segments.push({ name: result.name, value: result.value })
  }

  return segments
}

export default extractSegments
