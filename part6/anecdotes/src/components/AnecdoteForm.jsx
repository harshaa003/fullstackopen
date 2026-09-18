import useStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteForm = () => {
  const addAnecdote = useStore(state => state.addAnecdote)

  const showNotification = useNotificationStore(
    state => state.showNotification
  )

  const addNewAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    if (!content.trim()) return

    const savedAnecdote = await addAnecdote(content)

    showNotification(
      `a new anecdote '${savedAnecdote.content}' created`
    )

    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addNewAnecdote}>
        <input name="anecdote" />

        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm