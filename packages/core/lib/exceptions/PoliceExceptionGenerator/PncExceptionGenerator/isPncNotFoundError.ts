const isPncNotFoundError = (message: string): boolean => !!message.match(/^I1008.*ARREST\/SUMMONS REF .* NOT FOUND/)

export default isPncNotFoundError
