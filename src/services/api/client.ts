import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

export interface APIError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, any>
}

class APIClient {
  private client: AxiosInstance

  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('vms_access_token')
        if (token) {
          if (typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`)
          } else {
            ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
          }
        }

        if (import.meta.env.DEV) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error),
    )

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this.client(originalRequest)
          } catch (refreshError) {
            this.handleLogout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(this.normalizeError(error))
      },
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('vms_refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken })

        const { accessToken } = response.data
        localStorage.setItem('vms_access_token', accessToken)

        return accessToken
      } finally {
        this.refreshTokenPromise = null
      }
    })()

    return this.refreshTokenPromise
  }

  private handleLogout() {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/login'
  }

  private normalizeError(error: AxiosError): APIError {
    if (error.response) {
      const data = error.response.data as any
      return {
        message: data?.message || 'Erro na requisição',
        code: data?.code || 'API_ERROR',
        statusCode: error.response.status,
        details: data?.details,
      }
    }

    if (error.request) {
      return {
        message: 'Não foi possível conectar ao servidor',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      }
    }

    return {
      message: error.message || 'Erro desconhecido',
      code: 'REQUEST_ERROR',
      statusCode: 0,
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new APIClient()
