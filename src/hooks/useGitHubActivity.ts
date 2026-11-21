import { useEffect, useState } from 'react'

export interface LiveMerge {
  repo: string
  number: number
  title: string
  mergedAt: string
  url: string
}

export interface LiveProfile {
  publicRepos: number
  followers: number
  since: string
}

export type ActivityState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; merges: LiveMerge[]; profile: LiveProfile; fetchedAt: number }

const CACHE_KEY = 'gh-activity-v1'
const CACHE_MS = 60 * 60 * 1000

interface SearchItem {
  number: number
  title: string
  html_url: string
  repository_url: string
  pull_request?: { merged_at: string | null }
}

function readCache(): ActivityState | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Extract<ActivityState, { status: 'ready' }>
    return Date.now() - data.fetchedAt < CACHE_MS ? data : null
  } catch {
    return null
  }
}

/**
 * Public GitHub data for the Activity section: the profile's repository and
 * follower counts, and recent merged pull requests in the given external
 * repositories. Unauthenticated, cached for an hour per browser session, and
 * reported as an error (so the caller can show saved data) on any failure.
 * Nothing is requested until `enabled` is true.
 */
export function useGitHubActivity(
  user: string,
  repos: readonly string[],
  enabled: boolean,
): ActivityState {
  const [state, setState] = useState<ActivityState>(() => readCache() ?? { status: 'loading' })

  useEffect(() => {
    if (!enabled || state.status === 'ready') return
    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    const get = (url: string) =>
      fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
      }).then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`)
        return r.json()
      })

    const tracked = new Set(repos.map((r) => r.toLowerCase()))
    const query = encodeURIComponent(`author:${user} type:pr is:merged -user:${user}`)

    Promise.all([
      get(`https://api.github.com/users/${user}`),
      get(`https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=50`),
    ])
      .then(([profile, search]) => {
        if (cancelled) return
        const merges: LiveMerge[] = (search.items as SearchItem[])
          .map((item) => ({
            repo: item.repository_url.replace('https://api.github.com/repos/', ''),
            number: item.number,
            title: item.title,
            mergedAt: item.pull_request?.merged_at ?? '',
            url: item.html_url,
          }))
          .filter((m) => m.mergedAt && tracked.has(m.repo.toLowerCase()))
          .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
          .slice(0, 6)
        const next: ActivityState = {
          status: 'ready',
          merges,
          profile: {
            publicRepos: profile.public_repos,
            followers: profile.followers,
            since: profile.created_at,
          },
          fetchedAt: Date.now(),
        }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          // Caching is an optimisation; the data is still shown.
        }
        setState(next)
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      controller.abort()
    }
    // Fetch once per mount; `repos` is a module-level constant at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, enabled])

  return state
}
