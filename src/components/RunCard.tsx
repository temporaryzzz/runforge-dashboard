import { useState } from 'react'
import type { Run } from '../types'

type RunCardProps = {
  run: Run
}

const statusLabels: Record<Run['status'], string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
}

const statusStyles: Record<Run['status'], { badge: string; dot: string }> = {
  queued: { badge: 'border-gray-300 bg-gray-100 text-gray-800', dot: 'bg-gray-500' },
  running: { badge: 'border-yellow-300 bg-yellow-100 text-yellow-900', dot: 'bg-yellow-600' },
  succeeded: { badge: 'border-green-300 bg-green-100 text-green-900', dot: 'bg-green-600' },
  failed: { badge: 'border-red-300 bg-red-100 text-red-900', dot: 'bg-red-600' },
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatDuration(seconds?: number) {
  if (seconds === undefined) return '—'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}

export function RunCard({ run }: RunCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400 cursor-pointer sm:p-6 " 
      onClick={() => {setShowInfo(!showInfo)}}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight text-black">{run.name}</h2>
          <p className="mt-1 truncate text-sm text-neutral-600">{run.repository}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[run.status].badge}`}>
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${statusStyles[run.status].dot}`} />
          {statusLabels[run.status]}
        </span>
      </div>

      <div
        aria-hidden={!showInfo}
        className={`grid transition-all duration-500 ease-in-out ${
          showInfo ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 text-sm sm:grid-cols-3">
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Branch</dt>
              <dd className="mt-1 truncate font-mono text-neutral-800">{run.branch}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Created</dt>
              <dd className="mt-1 text-neutral-800">{formatCreatedAt(run.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Duration</dt>
              <dd className="mt-1 text-neutral-800">{formatDuration(run.durationSeconds)}</dd>
            </div>
          </dl>

          <section aria-label="Run logs" className="mt-5 border-t border-neutral-100 pt-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Logs</h3>
            {run.logs.length > 0 ? (
              <ol className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg bg-neutral-50 p-3 font-mono text-xs leading-5 text-neutral-700">
                {run.logs.map((log, index) => (
                  <li className="flex gap-3" key={`${index}-${log}`}>
                    <span aria-hidden="true" className="shrink-0 text-neutral-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="break-words">{log}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-neutral-500">No logs available.</p>
            )}
          </section>
        </div>
      </div>

      <span className={`text-gray-500 text-xs ${showInfo ? 'hidden' : ''} hover:text-gray-700`}>
        <p>{'Нажмите, чтобы увидеть подробности'}</p>
      </span>
    </article>
  )
}
