const isPncNotFoundError = (message: string): boolean => /^I1008.*ARREST\/SUMMONS REF .* NOT FOUND/.test(message)

export default isPncNotFoundError
