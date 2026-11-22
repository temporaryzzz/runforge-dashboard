export function LoadingState() {
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-xl border border-neutral-200 px-5 py-12 text-sm text-neutral-500"
      role="status"
    >
      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      Загружаем…
    </div>
  )
}
