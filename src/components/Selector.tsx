import { useEffect, useId, useRef, useState } from 'react'

export type SelectOption<Value extends string> = {
  label: string
  value: Value
}

type SelectProps<Value extends string> = {
  label: string
  value: Value[]
  options: SelectOption<Value>[]
  onChange: (values: Value[]) => void
}

export function Selector<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<Value>) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
  const displayValue = selectedLabels.length > 0 ? selectedLabels.join(', ') : '—'

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function toggleOption(optionValue: Value) {
    onChange(
      value.includes(optionValue)
        ? value.filter((selectedValue) => selectedValue !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <div className="grid w-full min-w-0 gap-1.5" ref={rootRef}>
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500" htmlFor={id}>
        {label}
      </label>
      <div className="relative min-w-0">
        <button
          aria-controls={`${id}-options`}
          aria-label="Status filter"
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-white px-3 text-left text-sm text-neutral-900 outline-none transition-colors hover:border-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          id={id}
          onClick={() => setIsOpen((open) => !open)}
          ref={triggerRef}
          type="button"
        >
          <span className="min-w-0 flex-1 truncate">{displayValue}</span>
          <svg
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </button>

        {isOpen && (
          <div
            aria-label={`${label} options`}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
            id={`${id}-options`}
            role="group"
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)

              return (
                <button
                  aria-pressed={isSelected}
                  className="flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
