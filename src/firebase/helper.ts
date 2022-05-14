export function to<T = Record<string, unknown>>(object: Record<string, any>): T {
  const newObject: Record<string, unknown> = {}
  for (const key in object) {
    const value = object[key]
    if (key === "expires") {
      newObject.expires = value.getTime();
    } else {
      newObject[key] = value
    }
  }
  return newObject as T
}
export function from<T = Record<string, unknown>>(object: Record<string, any>): T {
  const newObject: Record<string, unknown> = {}
  for (const key in object) {
    const value = object[key]
    if (key === "expires") {
      newObject.expires = new Date(value);
    } else {
      newObject[key] = value
    }
  }
  return newObject as T
}
