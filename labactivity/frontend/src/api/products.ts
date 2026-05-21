import type { ProductSearchParams, SearchResponse } from '../types/product'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function searchProducts(
  params: ProductSearchParams,
): Promise<SearchResponse> {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })

  const queryString = query.toString()
  const response = await fetch(
    `${API_BASE_URL}/api/products/search${queryString ? `?${queryString}` : ''}`,
  )

  if (!response.ok) {
    let body: unknown = null
    try {
      body = await response.json()
    } catch {
      body = await response.text()
    }

    const message =
      typeof body === 'object' && body !== null && 'detail' in body
        ? String(body.detail)
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, body)
  }

  return response.json()
}
