import useStore from '../store'

const Filter = () => {
  const filter = useStore(state => state.filter)
  const setFilter = useStore(state => state.setFilter)

  const handleChange = event => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter{' '}
      <input
        data-testid="filter"
        value={filter}
        onChange={handleChange}
      />
    </div>
  )
}

export default Filter