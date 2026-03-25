export const convertToPncDate = (dateString: string) => dateString.slice(0, 11).split("-").reverse().join("")
