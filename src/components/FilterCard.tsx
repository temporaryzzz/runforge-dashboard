type FilterCardProps = {
  label: string
  onRemove: () => void
}

export function FilterCard({ label, onRemove }: FilterCardProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-300 bg-white py-1 pl-3 pr-1 text-xs text-neutral-800">
      <span className="truncate">{label}</span>
      <button
        aria-label={`Remove ${label} filter`}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-base leading-none text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black"
        onClick={onRemove}
        type="button"
      >
        ×
      </button>
    </span>
  )
}
