// API client configuration
const API_BASE_URL = '/api'

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    timestamp: string
    version: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Generic fetch wrapper
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText,
      code: `HTTP_${response.status}`,
      status: response.status,
    }
    throw error
  }

  return response.json()
}
