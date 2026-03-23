const isLedsNotFoundError = (message: string): boolean => /No matching arrest reports found for asn/i.test(message)

export default isLedsNotFoundError
