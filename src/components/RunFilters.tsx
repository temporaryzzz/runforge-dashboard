import { FilterCard } from './FilterCard'
import { Selector, type SelectOption } from './Selector'
import type { RunStatus } from '../types'

const statusOptions: SelectOption<RunStatus>[] = [
  { label: 'Queued', value: 'queued' },
  { label: 'Running', value: 'running' },
  { label: 'Succeeded', value: 'succeeded' },
  { label: 'Failed', value: 'failed' },
]

type RunFiltersProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: RunStatus[]
  onStatusFilterChange: (value: RunStatus[]) => void
}

export function RunFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: RunFiltersProps) {
  const normalizedQuery = searchQuery.trim()
  const filterCards = [
    ...statusFilter.map((status) => {
      const option = statusOptions.find(({ value }) => value === status)
      return option
        ? {
            id: `status-${status}`,
            label: option.label,
            onRemove: () => onStatusFilterChange(statusFilter.filter((value) => value !== status)),
          }
        : null
    }).filter((filter): filter is NonNullable<typeof filter> => filter !== null),
    ...(normalizedQuery
      ? [{
          id: 'search',
          label: `Search: ${normalizedQuery}`,
          onRemove: () => onSearchQueryChange(''),
        }]
      : []),
  ]

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Search runs</span>
          <span className="relative block">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            <input
              className={`h-11 w-full rounded-lg border pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black ${
                normalizedQuery
                  ? 'border-black bg-neutral-50 ring-1 ring-black'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
              aria-label='Search runs'
              onChange={(event) => onSearchQueryChange(event.currentTarget.value)}
              placeholder="Name or repository"
              type="search"
              value={searchQuery}
            />
          </span>
        </label>
        <Selector
          label="Status"
          onChange={onStatusFilterChange}
          options={statusOptions}
          value={statusFilter}
        />
      </div>

      {filterCards.length > 0 && (
        <div aria-label="Active filters" className="mb-6 flex flex-wrap gap-2" role="group">
          {filterCards.map((filter) => (
            <FilterCard key={filter.id} label={filter.label} onRemove={filter.onRemove} />
          ))}
        </div>
      )}
    </>
  )
}
