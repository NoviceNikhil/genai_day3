import { http, HttpResponse } from 'msw'

const baseUrl = 'http://localhost:8000'

export const handlers = [
  http.get(`${baseUrl}/api/products/search`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? undefined

    return HttpResponse.json(
      {
        results: [
          {
            id: 1,
            name: 'Test Laptop',
            category: 'electronics',
            price: 299.99,
            description: 'A test laptop',
            in_stock: true,
          },
          {
            id: 2,
            name: 'Test Book',
            category: 'books',
            price: 14.99,
            description: 'A test book',
            in_stock: false,
          },
        ],
        total: 2,
        query: { q },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }),
]

export const errorHandlers = [
  http.get(`${baseUrl}/api/products/search`, () =>
    HttpResponse.json({ detail: 'Internal server error' }, { status: 500 }),
  ),
]
