export const validateQueryParams = (param: string | string[] | undefined): param is string => typeof param === "string"
