import { create } from 'zustand'

const useStore = create(set => ({
  anecdotes: [],
  filter: '',

  setFilter: filter =>
    set({ filter }),

  setAnecdotes: anecdotes =>
    set({ anecdotes }),

  initializeAnecdotes: async () => {
    const response = await fetch('http://localhost:3001/anecdotes')
    const data = await response.json()

    set({ anecdotes: data })
  },

  addAnecdote: async content => {
    const newAnecdote = {
      content,
      votes: 0
    }

    const response = await fetch('http://localhost:3001/anecdotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAnecdote)
    })

    const savedAnecdote = await response.json()

    set(state => ({
      anecdotes: [...state.anecdotes, savedAnecdote]
    }))

    return savedAnecdote
  },

  vote: async id => {
    const state = useStore.getState()

    const anecdote = state.anecdotes.find(a => a.id === id)

    if (!anecdote) return

    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const response = await fetch(
      `http://localhost:3001/anecdotes/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnecdote)
      }
    )

    const savedAnecdote = await response.json()

    set(state => ({
      anecdotes: state.anecdotes.map(a =>
        a.id === id ? savedAnecdote : a
      )
    }))

    return savedAnecdote
  },

  deleteAnecdote: async id => {
    const state = useStore.getState()

    const anecdote = state.anecdotes.find(a => a.id === id)

    if (!anecdote || anecdote.votes !== 0) return

    await fetch(`http://localhost:3001/anecdotes/${id}`, {
      method: 'DELETE'
    })

    set(state => ({
      anecdotes: state.anecdotes.filter(a => a.id !== id)
    }))
  }
}))

export default useStore