import useStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useStore(state => state.anecdotes)
  const filter = useStore(state => state.filter)
  const vote = useStore(state => state.vote)
  const deleteAnecdote = useStore(state => state.deleteAnecdote)

  const showNotification = useNotificationStore(
    state => state.showNotification
  )

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = filteredAnecdotes.toSorted(
    (a, b) => b.votes - a.votes
  )

  const handleVote = async anecdote => {
    await vote(anecdote.id)

    showNotification(
      `you voted '${anecdote.content}'`
    )
  }

  const handleDelete = async anecdote => {
    await deleteAnecdote(anecdote.id)
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <p>{anecdote.content}</p>

          <p>
            has {anecdote.votes} votes
          </p>

          <button onClick={() => handleVote(anecdote)}>
            vote
          </button>

          {anecdote.votes === 0 && (
            <button onClick={() => handleDelete(anecdote)}>
              delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList