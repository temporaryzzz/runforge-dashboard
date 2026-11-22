import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { fetchRuns } from './api'
import type { Run } from './types'

vi.mock('./api', () => ({
    fetchRuns: vi.fn()
}))

afterEach(cleanup)

const testRuns: Run[] = [
  {
    id: '1',
    name: 'Queued run',
    repository: 'acme/queued',
    branch: 'main',
    status: 'queued',
    createdAt: '2026-11-22T18:00:00Z',
    logs: ['Queued run created', 'Waiting for an agent'],
  },
  {
    id: '2',
    name: 'Succeeded run',
    repository: 'acme/success',
    branch: 'main',
    status: 'succeeded',
    createdAt: '2026-11-22T18:00:00Z',
    logs: [],
  },
]

describe('Run list filters', () => {
    beforeEach(() => {
        vi.mocked(fetchRuns).mockReset()
    })

    it('shows only runs with selected status', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchRuns).mockResolvedValue(testRuns)
        render(<App />)

        expect(await screen.findByRole('heading', { name: 'Queued run' })).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Status filter' }))
        await user.click(screen.getByRole('button', { name: 'Succeeded' }))
        expect(screen.getByRole('heading', { name: 'Succeeded run' })).toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: 'Queued run' })).not.toBeInTheDocument()
    })

    it('search by name or repository', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchRuns).mockResolvedValue(testRuns)
        render(<App />)

        expect(await screen.findByRole('heading', { name: 'Queued run' })).toBeInTheDocument()

        await user.type(
            screen.getByRole('searchbox', { name: 'Search runs' }),
            'Succeeded run'
        )

        expect(screen.getByRole('heading', { name: 'Succeeded run' })).toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: 'Queued run' })).not.toBeInTheDocument()
    })

})

describe('Run card details', () => {
    beforeEach(() => {
        vi.mocked(fetchRuns).mockReset()
    })

    it('opens run details and displays logs', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchRuns).mockResolvedValue(testRuns)
        render(<App />)

        const runHeading = await screen.findByRole('heading', { name: 'Queued run' })
        expect(screen.queryByRole('heading', { name: 'Logs' })).not.toBeInTheDocument()

        await user.click(runHeading)

        expect(screen.getByRole('heading', { name: 'Logs' })).toBeInTheDocument()
        expect(screen.getByText('Queued run created')).toBeInTheDocument()
        expect(screen.getByText('Waiting for an agent')).toBeInTheDocument()
    })
})