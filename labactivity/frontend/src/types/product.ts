export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'home'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  in_stock: boolean
}

export interface ProductSearchParams {
  q?: string
  category?: string
  min_price?: number
  max_price?: number
}

export interface SearchResponse {
  results: Product[]
  total: number
  query: ProductSearchParams
}
