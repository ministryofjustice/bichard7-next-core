export const convertToPncDate = (dateString: string) => dateString.slice(0, 11).split("-").reverse().join("")

export const convertToPncTime = (time: string) => time.slice(0, 5).replace(":", "")
