const isLedsNotFoundError = (message: string): boolean => !!message.match(/No matching arrest reports found for asn/i)

export default isLedsNotFoundError
