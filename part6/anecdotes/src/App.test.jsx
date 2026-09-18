import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useStore from './store'
import AnecdoteList from './components/AnecdoteList'

const anecdotes = [
  {
    id: '1',
    content: 'First anecdote',
    votes: 5
  },
  {
    id: '2',
    content: 'Second anecdote',
    votes: 10
  },
  {
    id: '3',
    content: 'Third anecdote',
    votes: 2
  }
]

beforeEach(() => {
  useStore.setState({
    anecdotes: [],
    filter: ''
  })

  vi.restoreAllMocks()
})

describe('Anecdotes', () => {
  it('6.12 state is initialized with anecdotes returned by the backend', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => anecdotes
    })

    await useStore.getState().initializeAnecdotes()

    expect(useStore.getState().anecdotes).toEqual(anecdotes)
  })

  it('6.13 anecdotes are displayed sorted by votes', () => {
    useStore.setState({
      anecdotes,
      filter: ''
    })

    render(<AnecdoteList />)

    const first = screen.getByText('Second anecdote')
    const second = screen.getByText('First anecdote')
    const third = screen.getByText('Third anecdote')

    expect(
      first.compareDocumentPosition(second) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    expect(
      second.compareDocumentPosition(third) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('6.14 the anecdote list receives a properly filtered list', () => {
    useStore.setState({
      anecdotes,
      filter: 'second'
    })

    render(<AnecdoteList />)

    expect(screen.getByText('Second anecdote')).toBeInTheDocument()
    expect(screen.queryByText('First anecdote')).not.toBeInTheDocument()
    expect(screen.queryByText('Third anecdote')).not.toBeInTheDocument()
  })

  it('6.15 voting increases the number of votes', async () => {
    const votedAnecdote = {
      ...anecdotes[0],
      votes: 6
    }

    useStore.setState({
      anecdotes,
      filter: '',
      vote: vi.fn().mockImplementation(async id => {
        useStore.setState({
          anecdotes: useStore.getState().anecdotes.map(a =>
            a.id === id ? votedAnecdote : a
          )
        })
      })
    })

    render(<AnecdoteList />)

    const anecdote = screen.getByText('First anecdote').parentElement

    expect(anecdote).toHaveTextContent('has 5 votes')

    fireEvent.click(
      screen.getAllByRole('button', { name: 'vote' })[1]
    )

    await waitFor(() => {
      expect(anecdote).toHaveTextContent('has 6 votes')
    })
  })
})
