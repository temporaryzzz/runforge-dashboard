import { useEffect, useState } from 'react'
import { fetchRuns } from './api'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import { RunCard } from './components/RunCard'
import { RunFilters } from './components/RunFilters'
import type { Run, RunStatus } from './types'

type RunsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; runs: Run[] }

function App() {
  const [state, setState] = useState<RunsState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [statusFilter, setStatusFilter] = useState<RunStatus[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetchRuns(controller.signal)
      .then((runs) => {
        if (!controller.signal.aborted) setState({ status: 'success', runs })
      })  
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        console.error('Failed to load runs:', cause)
        setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [reloadKey])

  const runs = state.status === 'success' ? state.runs : []
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredRuns = runs.filter((run) => {
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(run.status)
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${run.name} ${run.repository}`.toLowerCase().includes(normalizedQuery)

    return matchesStatus && matchesQuery
  })

  function retryLoading() {
    setState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 border-b border-neutral-200 pb-7 sm:mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Runforge / Agent activity
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Runs</h1>
            <p className="mt-2 text-sm text-neutral-600">Recent agent runs across your repositories.</p>
          </div>
          {state.status === 'success' && (
            <p className="text-sm text-neutral-500">
              {filteredRuns.length} {filteredRuns.length === 1 ? 'run' : 'runs'}
            </p>
          )}
        </div>
      </header>

      {state.status === 'loading' ? (
        <LoadingState />
      ) : state.status === 'error' ? (
        <ErrorState onRetry={retryLoading} />
      ) : state.runs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <RunFilters
            onSearchQueryChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />

          {filteredRuns.length === 0 ? (
            <EmptyState
              actionLabel="Сбросить фильтры"
              onAction={() => {
                setSearchQuery('')
                setStatusFilter([])
              }}
            />
          ) : (
            <section aria-label="Run list" className="grid gap-4">
              {filteredRuns.map((run) => <RunCard key={run.id} run={run} />)}
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default App
