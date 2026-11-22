type EmptyStateProps = {
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-neutral-200 px-5 py-12 text-center">
      <p className="font-medium text-black">Пока что здесь ничего нет</p>
      {actionLabel && onAction && (
        <button
          className="mt-5 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-black hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
