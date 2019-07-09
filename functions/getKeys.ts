export const getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>
