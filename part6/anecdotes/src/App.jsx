import { useEffect } from 'react'
import Filter from './components/Filter'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import useStore from './store'

const App = () => {
  const initializeAnecdotes = useStore(
    state => state.initializeAnecdotes
  )

  useEffect(() => {
    initializeAnecdotes()
  }, [initializeAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>

      <Notification />

      <Filter />

      <AnecdoteList />

      <AnecdoteForm />
    </div>
  )
}

export default App