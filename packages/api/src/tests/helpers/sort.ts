export const sortStringAsc = (array: string[]): string[] => [...array].sort((one, two) => (one > two ? 1 : -1))

export const sortStringDesc = (array: string[]): string[] => [...array].sort((one, two) => (one > two ? -1 : 1))
