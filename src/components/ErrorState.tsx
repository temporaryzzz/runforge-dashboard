type ErrorStateProps = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-neutral-200 px-5 py-10 text-center" role="alert">
      <p className="font-medium text-black">Произошла ошибка, повторите позднее</p>
      <button
        className="mt-5 rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        onClick={onRetry}
        type="button"
      >
        Перезагрузить
      </button>
    </div>
  )
}
