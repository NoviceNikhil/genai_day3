import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { errorHandlers } from '../../mocks/handlers'
import { server } from '../../mocks/server'
import ProductSearch from './ProductSearch'

describe('ProductSearch', () => {
  it('renders search form with all filter inputs', () => {
    render(<ProductSearch />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('category-select')).toBeInTheDocument()
    expect(screen.getByTestId('min-price-input')).toBeInTheDocument()
    expect(screen.getByTestId('max-price-input')).toBeInTheDocument()
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
  })

  it('shows empty state message initially', () => {
    render(<ProductSearch />)

    expect(screen.getByTestId('empty-state')).toHaveTextContent('No products found')
  })

  it('calls API and displays results on search', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.type(screen.getByTestId('search-input'), 'laptop')
    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument()
    })
    expect(screen.getAllByTestId('result-item')).toHaveLength(2)
  })

  it('shows loading state while searching', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.click(screen.getByTestId('search-button'))

    expect(screen.getByTestId('loading-indicator')).toHaveTextContent('Searching...')
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  it('shows result count after successful search', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 products')).toBeInTheDocument()
    })
  })

  it('displays product name, category, price, stock status', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument()
    })
    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('$299.99')).toBeInTheDocument()
    expect(screen.getByText('In stock')).toBeInTheDocument()
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('reset button clears all inputs and results', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.type(screen.getByTestId('search-input'), 'book')
    await user.selectOptions(screen.getByTestId('category-select'), 'books')
    await user.type(screen.getByTestId('min-price-input'), '10')
    await user.type(screen.getByTestId('max-price-input'), '50')
    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('reset-button'))

    expect(screen.getByTestId('search-input')).toHaveValue('')
    expect(screen.getByTestId('category-select')).toHaveValue('')
    expect(screen.getByTestId('min-price-input')).toHaveValue(null)
    expect(screen.getByTestId('max-price-input')).toHaveValue(null)
    expect(screen.queryByText('Test Book')).not.toBeInTheDocument()
  })

  it('shows client-side error when min price > max price', async () => {
    const user = userEvent.setup()
    render(<ProductSearch />)

    await user.type(screen.getByTestId('min-price-input'), '500')
    await user.type(screen.getByTestId('max-price-input'), '100')
    await user.click(screen.getByTestId('search-button'))

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Min price must be less than or equal to max price.',
    )
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    expect(screen.queryByTestId('result-item')).not.toBeInTheDocument()
  })

  it('shows error message on API failure', async () => {
    const user = userEvent.setup()
    server.use(...errorHandlers)
    render(<ProductSearch />)

    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Internal server error',
      )
    })
  })

  it('shows empty state when search returns no results', async () => {
    const user = userEvent.setup()
    server.use(
      http.get('http://localhost:8000/api/products/search', () =>
        HttpResponse.json({ results: [], total: 0, query: {} }),
      ),
    )
    render(<ProductSearch />)

    await user.click(screen.getByTestId('search-button'))

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toHaveTextContent(
        'No products found',
      )
    })
    expect(screen.queryByTestId('result-item')).not.toBeInTheDocument()
  })
})
