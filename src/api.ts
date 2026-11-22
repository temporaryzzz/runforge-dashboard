import type { Run } from './types'

export async function fetchRuns(signal?: AbortSignal): Promise<Run[]> {
  const response = await fetch('/api/runs', { signal })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }

  return response.json() as Promise<Run[]>
}