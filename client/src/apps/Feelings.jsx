import { useState } from 'react'

const feelings = [
  { name: 'Joyful', color: '#f4cf45' },
  { name: 'Calm', color: '#65b89a' },
  { name: 'Loved', color: '#e48a9b' },
  { name: 'Sad', color: '#6b91c9' },
  { name: 'Angry', color: '#d65b4a' },
  { name: 'Anxious', color: '#a982bd' },
  { name: 'Tired', color: '#8c9298' },
  { name: 'Hopeful', color: '#79ad55' },
]

function Feelings({ onLogFeeling }) {
  const [selectedFeeling, setSelectedFeeling] = useState(null)

  function chooseFeeling(feeling) {
    setSelectedFeeling(feeling)
    onLogFeeling(feeling)
  }

  return (
    <div className="feelings-app">
      <div className="feelings-app__prompt">
        <strong>How are you feeling right now?</strong>
        <span>Choose the word that feels closest.</span>
      </div>
      <div className="feelings-wheel" aria-label="Feelings wheel">
        <div className="feelings-wheel__center" aria-hidden="true">I feel...</div>
        {feelings.map((feeling, index) => (
          <button
            key={feeling.name}
            className={selectedFeeling?.name === feeling.name ? 'is-selected' : ''}
            style={{ '--feeling-index': index, '--feeling-color': feeling.color }}
            type="button"
            onClick={() => chooseFeeling(feeling)}
            aria-pressed={selectedFeeling?.name === feeling.name}
          >
            {feeling.name}
          </button>
        ))}
      </div>
      <div className="feelings-app__status" role="status">
        {selectedFeeling
          ? `${selectedFeeling.name} was added to Mood History.`
          : 'No feeling logged yet.'}
      </div>
    </div>
  )
}

export default Feelings
