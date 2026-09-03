import { useState } from 'react'

function Journal() {
  const [entry, setEntry] = useState('')
  const [status, setStatus] = useState('')

  function handleSave() {
    setStatus(entry.trim() ? 'Saved for this session.' : 'Nothing to save yet.')
  }

  return (
    <div className="journal-app">
      <div className="journal-app__menu" aria-label="Journal menu">
        <button type="button"><u>F</u>ile</button>
        <button type="button"><u>E</u>dit</button>
        <button type="button"><u>H</u>elp</button>
      </div>
      <div className="journal-app__body">
        <label htmlFor="journal-entry">Today&apos;s entry</label>
        <textarea
          id="journal-entry"
          value={entry}
          onChange={(event) => {
            setEntry(event.target.value)
            setStatus('')
          }}
          placeholder="Write what is on your mind..."
          autoFocus
        />
        <div className="journal-app__actions">
          <span role="status">{status}</span>
          <button className="win95-button" type="button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default Journal
