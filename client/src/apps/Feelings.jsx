import { useState } from 'react'
import { feelingGroups, feelings } from '../data/feelings'

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
        {feelingGroups.map((group, groupIndex) => (
          <section
            className="feelings-wheel__group"
            key={group.name}
            style={{ '--group-color': group.color, '--group-index': groupIndex }}
          >
            <strong>{group.shortName}</strong>
            <div>
              {feelings.filter((feeling) => feeling.group === group.name).map((feeling) => (
                <button
                  key={feeling.name}
                  className={selectedFeeling?.name === feeling.name ? 'is-selected' : ''}
                  type="button"
                  onClick={() => chooseFeeling(feeling)}
                  aria-pressed={selectedFeeling?.name === feeling.name}
                >
                  {feeling.name}
                </button>
              ))}
            </div>
          </section>
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
