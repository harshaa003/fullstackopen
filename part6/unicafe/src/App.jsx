import { create } from 'zustand'

const useStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,

  incrementGood: () =>
    set(state => ({
      good: state.good + 1
    })),

  incrementNeutral: () =>
    set(state => ({
      neutral: state.neutral + 1
    })),

  incrementBad: () =>
    set(state => ({
      bad: state.bad + 1
    }))
}))

const Statistics = () => {
  const good = useStore(state => state.good)
  const neutral = useStore(state => state.neutral)
  const bad = useStore(state => state.bad)

  const all = good + neutral + bad

  const average =
    all === 0
      ? 0
      : (good - bad) / all

  const positive =
    all === 0
      ? 0
      : (good / all) * 100

  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>

        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>

        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>

        <tr>
          <td>all</td>
          <td>{all}</td>
        </tr>

        <tr>
          <td>average</td>
          <td>{average}</td>
        </tr>

        <tr>
          <td>positive</td>
          <td>{positive} %</td>
        </tr>
      </tbody>
    </table>
  )
}

const App = () => {
  const incrementGood = useStore(state => state.incrementGood)
  const incrementNeutral = useStore(state => state.incrementNeutral)
  const incrementBad = useStore(state => state.incrementBad)

  return (
    <div>
      <h1>Unicafe</h1>

      <button onClick={incrementGood}>
        good
      </button>

      <button onClick={incrementNeutral}>
        neutral
      </button>

      <button onClick={incrementBad}>
        bad
      </button>

      <h2>statistics</h2>

      <Statistics />
    </div>
  )
}

export default App