import useNotificationStore from '../notificationStore'

const Notification = () => {
  const message = useNotificationStore(
    state => state.message
  )

  if (!message) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div
      data-testid="notification"
      style={style}
    >
      {message}
    </div>
  )
}

export default Notification