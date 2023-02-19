
export const API_URL = 'https://api.fluro.io/'

export interface ApiFetchInfo<T> {
  path: string
  fetch: RequestInit
  parse: (json: any) => T
}