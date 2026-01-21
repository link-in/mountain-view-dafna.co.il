/**
 * Beds24 Token Manager
 * Manages automatic token refresh when access token expires
 */

interface TokenData {
  accessToken: string
  expiresAt: number // timestamp in milliseconds
  refreshToken: string
}

class Beds24TokenManager {
  private tokenData: TokenData | null = null
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.loadFromEnv()
  }

  /**
   * Load initial tokens from environment variables
   */
  private loadFromEnv() {
    const accessToken = process.env.BEDS24_TOKEN
    const refreshToken = process.env.BEDS24_REFRESH_TOKEN

    if (accessToken && refreshToken) {
      // Assume token expires in 24 hours if we don't have exact expiry
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      this.tokenData = {
        accessToken,
        expiresAt,
        refreshToken,
      }
    }
  }

  /**
   * Get a valid access token (refresh if needed)
   */
  async getAccessToken(): Promise<string> {
    // If we have a valid token, return it
    if (this.tokenData && this.tokenData.expiresAt > Date.now() + 5 * 60 * 1000) {
      return this.tokenData.accessToken
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Start a new refresh
    this.refreshPromise = this.refreshAccessToken()
    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    if (!this.tokenData?.refreshToken) {
      throw new Error('No refresh token available. Please set BEDS24_REFRESH_TOKEN in environment variables.')
    }

    const baseUrl = process.env.BEDS24_API_BASE_URL ?? 'https://api.beds24.com/v2'
    
    try {
      const response = await fetch(`${baseUrl}/authentication/token`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          refreshToken: this.tokenData.refreshToken,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as {
        token: string
        expiresIn: number
      }

      // Update token data
      this.tokenData = {
        accessToken: data.token,
        expiresAt: Date.now() + data.expiresIn * 1000,
        refreshToken: this.tokenData.refreshToken,
      }

      console.log('[Beds24] Access token refreshed successfully')
      return data.token
    } catch (error) {
      console.error('[Beds24] Token refresh failed:', error)
      throw error
    }
  }

  /**
   * Force refresh the access token (useful after 401/502 errors)
   */
  async forceRefresh(): Promise<string> {
    this.refreshPromise = this.refreshAccessToken()
    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Setup initial tokens from invite code
   * This should be run once to get the refresh token
   */
  static async setupFromInviteCode(inviteCode: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    const baseUrl = process.env.BEDS24_API_BASE_URL ?? 'https://api.beds24.com/v2'

    const response = await fetch(`${baseUrl}/authentication/setup`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        code: inviteCode,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to setup tokens: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as {
      token: string
      expiresIn: number
      refreshToken: string
    }

    console.log('[Beds24] Tokens setup successfully')
    console.log('Add these to your .env.local:')
    console.log(`BEDS24_TOKEN=${data.token}`)
    console.log(`BEDS24_REFRESH_TOKEN=${data.refreshToken}`)

    return {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    }
  }
}

// Singleton instance
export const tokenManager = new Beds24TokenManager()

/**
 * Fetch with automatic token refresh on 401/502 errors
 */
export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get current access token
  const token = await tokenManager.getAccessToken()

  // Add token to headers
  const headers = new Headers(options.headers)
  headers.set('token', token)
  headers.set('accept', 'application/json')

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  })

  // If we get 401 or 502, try refreshing the token once
  if (response.status === 401 || response.status === 502) {
    console.log(`[Beds24] Got ${response.status}, refreshing token...`)
    
    // Force refresh the token
    const newToken = await tokenManager.forceRefresh()

    // Retry with new token
    headers.set('token', newToken)
    response = await fetch(url, {
      ...options,
      headers,
    })
  }

  return response
}
