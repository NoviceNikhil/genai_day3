import { FormEvent, useState } from 'react'

import { ApiError, searchProducts } from '../../api/products'
import type {
  Product,
  ProductCategory,
  ProductSearchParams,
  SearchStatus,
} from '../../types/product'
import styles from './ProductSearch.module.css'

const categories: Array<ProductCategory | ''> = [
  '',
  'electronics',
  'clothing',
  'books',
  'home',
]

export function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const resetSearch = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSearchStatus('idle')
    setResults([])
    setTotalCount(0)
    setErrorMessage('')
    setHasSearched(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const min = minPrice === '' ? undefined : Number(minPrice)
    const max = maxPrice === '' ? undefined : Number(maxPrice)

    if (min !== undefined && max !== undefined && min > max) {
      setSearchStatus('error')
      setErrorMessage('Min price must be less than or equal to max price.')
      return
    }

    const params: ProductSearchParams = {
      q: searchQuery.trim() || undefined,
      category: selectedCategory || undefined,
      min_price: min,
      max_price: max,
    }

    setSearchStatus('loading')
    setHasSearched(true)

    try {
      const response = await searchProducts(params)
      setResults(response.results)
      setTotalCount(response.total)
      setSearchStatus('success')
    } catch (error) {
      setResults([])
      setTotalCount(0)
      setSearchStatus('error')
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Something went wrong while searching products.',
      )
    }
  }

  const shouldShowEmptyState =
    searchStatus !== 'loading' && (!hasSearched || results.length === 0)

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <h1>Product Search</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="search-query">Search products</label>
          <input
            id="search-query"
            data-testid="search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Laptop, book, hoodie..."
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            data-testid="category-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value as ProductCategory | '')
            }
          >
            {categories.map((category) => (
              <option key={category || 'all'} value={category}>
                {category || 'All categories'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="min-price">Min price</label>
          <input
            id="min-price"
            data-testid="min-price-input"
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="max-price">Max price</label>
          <input
            id="max-price"
            data-testid="max-price-input"
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button
            data-testid="search-button"
            className={styles.searchButton}
            type="submit"
            disabled={searchStatus === 'loading'}
          >
            {searchStatus === 'loading' ? 'Searching...' : 'Search'}
          </button>
          <button
            data-testid="reset-button"
            className={styles.resetButton}
            type="button"
            onClick={resetSearch}
          >
            Clear
          </button>
        </div>
      </form>

      {searchStatus === 'loading' && (
        <p data-testid="loading-indicator" className={styles.loading}>
          Searching...
        </p>
      )}

      {errorMessage && (
        <div data-testid="error-message" className={styles.error} role="alert">
          {errorMessage}
        </div>
      )}

      {searchStatus === 'success' && (
        <p className={styles.resultsCount}>
          Showing {results.length} of {totalCount} products
        </p>
      )}

      {shouldShowEmptyState && (
        <p data-testid="empty-state" className={styles.emptyState}>
          No products found
        </p>
      )}

      <section
        data-testid="results-list"
        className={styles.resultsGrid}
        aria-label="Search results"
      >
        {results.map((product) => (
          <article
            key={product.id}
            data-testid="result-item"
            className={styles.productCard}
          >
            <div className={styles.cardHeader}>
              <h2>{product.name}</h2>
              <span
                className={
                  product.in_stock ? styles.inStockBadge : styles.outOfStockBadge
                }
              >
                {product.in_stock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default ProductSearch
