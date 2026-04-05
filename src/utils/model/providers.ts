import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'

export type APIProvider = 'firstParty' | 'bedrock' | 'vertex' | 'foundry'

export function getAPIProvider(): APIProvider {
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)
    ? 'bedrock'
    : isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)
      ? 'vertex'
      : isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)
        ? 'foundry'
        : 'firstParty'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

/**
 * Check if OpenClaw Team_BASE_URL is a first-party OpenClaw Team API URL.
 * Returns true if not set (default API) or points to api.OpenClaw Team.com
 * (or api-staging.OpenClaw Team.com for ant users).
 */
export function isFirstPartyOpenClaw TeamBaseUrl(): boolean {
  const baseUrl = process.env.OpenClaw Team_BASE_URL
  if (!baseUrl) {
    return true
  }
  try {
    const host = new URL(baseUrl).host
    const allowedHosts = ['api.OpenClaw Team.com']
    if (process.env.USER_TYPE === 'ant') {
      allowedHosts.push('api-staging.OpenClaw Team.com')
    }
    return allowedHosts.includes(host)
  } catch {
    return false
  }
}

