import { useState } from 'react'

const journalingPrompts = [
  'What is taking up the most space in your mind today?',
  'What felt lighter than expected today?',
  'What do you need to hear right now?',
  'Describe one small moment you want to remember.',
  'What are you learning about yourself lately?',
  'What would make tomorrow feel a little kinder?',
]

function getRandomPrompt() {
  return journalingPrompts[Math.floor(Math.random() * journalingPrompts.length)]
}

function formatEntryDate(date) {
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function entryTitle(entry) {
  const firstLine = entry.content.split('\n').find((line) => line.trim())
  return firstLine?.trim().slice(0, 30) || 'Untitled entry'
}

function Journal({
  entries,
  initialEntryId,
  selectedMood,
  onSelectMood,
  onClearMood,
  onCreateEntry,
  onUpdateEntry,
  onSave,
  onDeleteEntry,
  onOpenSavedEntry,
}) {
  const initialEntry = entries.find((item) => item.id === initialEntryId)
  const [entry, setEntry] = useState(() => initialEntry?.content || getRandomPrompt())
  const [currentEntryId, setCurrentEntryId] = useState(initialEntry?.id || null)
  const [status, setStatus] = useState(initialEntry ? `Editing ${entryTitle(initialEntry)}.` : '')
  const [openMenu, setOpenMenu] = useState(null)
  const [dialog, setDialog] = useState(null)

  function closeMenu() {
    setOpenMenu(null)
  }

  function startNewEntry() {
    setEntry(getRandomPrompt())
    setCurrentEntryId(null)
    onClearMood()
    setStatus('New entry.')
    closeMenu()
  }

  function generatePrompt() {
    setEntry(getRandomPrompt())
    setCurrentEntryId(null)
    onClearMood()
    setStatus('New prompt ready.')
  }

  function handleSave() {
    if (!entry.trim()) {
      setStatus('Nothing to save yet.')
      return
    }

    if (currentEntryId) {
      onUpdateEntry(currentEntryId, entry, selectedMood)
      setStatus('Changes saved for this session.')
    } else {
      const savedEntry = onCreateEntry(entry, selectedMood)
      setCurrentEntryId(savedEntry.id)
      setStatus('Entry saved for this session.')
    }
    onSave()
    closeMenu()
  }

  function openEntry(savedEntry) {
    onOpenSavedEntry(savedEntry.id)
    closeMenu()
  }

  function confirmDelete() {
    if (!currentEntryId) {
      setStatus('Save or open an entry before deleting.')
      closeMenu()
      return
    }

    setDialog('delete')
    closeMenu()
  }

  function deleteCurrentEntry() {
    onDeleteEntry(currentEntryId)
    setEntry('')
    setCurrentEntryId(null)
    onClearMood()
    setStatus('Entry deleted.')
    setDialog(null)
  }

  return (
    <div className="journal-app" onClick={() => openMenu && closeMenu()}>
      <div className="journal-app__menu" aria-label="Journal menu">
        <div className="journal-menu">
          <button
            className={openMenu === 'file' ? 'is-open' : ''}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setOpenMenu((menu) => menu === 'file' ? null : 'file')
            }}
            aria-expanded={openMenu === 'file'}
          >
            <u>F</u>ile
          </button>
          {openMenu === 'file' && (
            <div className="journal-menu__dropdown" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={startNewEntry}><span><u>N</u>ew</span><kbd>Ctrl+N</kbd></button>
              <button type="button" onClick={handleSave}><span><u>S</u>ave</span><kbd>Ctrl+S</kbd></button>
            </div>
          )}
        </div>
        <div className="journal-menu">
          <button
            className={openMenu === 'edit' ? 'is-open' : ''}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setOpenMenu((menu) => menu === 'edit' ? null : 'edit')
            }}
            aria-expanded={openMenu === 'edit'}
          >
            <u>E</u>dit
          </button>
          {openMenu === 'edit' && (
            <div className="journal-menu__dropdown journal-menu__dropdown--entries" onClick={(event) => event.stopPropagation()}>
              <div className="journal-menu__heading">Open saved entry</div>
              {entries.length === 0 ? (
                <div className="journal-menu__empty">No saved entries</div>
              ) : entries.map((savedEntry) => (
                <button
                  className={currentEntryId === savedEntry.id ? 'is-current' : ''}
                  key={savedEntry.id}
                  type="button"
                  onClick={() => openEntry(savedEntry)}
                >
                  <span>{entryTitle(savedEntry)}</span>
                  <time>{formatEntryDate(savedEntry.updatedAt)}</time>
                </button>
              ))}
              <div className="journal-menu__separator" />
              <button type="button" onClick={confirmDelete} disabled={!currentEntryId}>
                <span><u>D</u>elete current entry</span>
              </button>
            </div>
          )}
        </div>
        <div className="journal-menu">
          <button
            className={openMenu === 'help' ? 'is-open' : ''}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setOpenMenu((menu) => menu === 'help' ? null : 'help')
            }}
            aria-expanded={openMenu === 'help'}
          >
            <u>H</u>elp
          </button>
          {openMenu === 'help' && (
            <div className="journal-menu__dropdown" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => {
                setDialog('help')
                closeMenu()
              }}>
                <span>Journal <u>H</u>elp</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="journal-app__body">
        <label htmlFor="journal-entry">
          {currentEntryId ? 'Editing saved entry' : 'New journal entry'}
        </label>
        <textarea
          id="journal-entry"
          value={entry}
          onChange={(event) => {
            setEntry(event.target.value)
            setStatus('')
          }}
          autoFocus
        />
        <div className="journal-app__mood">
          {selectedMood ? (
            <span className="journal-app__mood-selection">
              <span style={{ backgroundColor: selectedMood.color }} aria-hidden="true" />
              {selectedMood.name}
            </span>
          ) : (
            <span>No mood attached</span>
          )}
          <button className="win95-button" type="button" onClick={onSelectMood}>
            Log mood
          </button>
        </div>
        <div className="journal-app__actions">
          <span role="status">{status}</span>
          <button
            className="journal-prompt-button"
            type="button"
            onClick={generatePrompt}
            aria-label="Generate a new journaling prompt"
            title="Generate a new journaling prompt"
          >
            ⚄
          </button>
          <span className="journal-prompt-hint">Click the dice for a new prompt</span>
          <button className="win95-button" type="button" onClick={handleSave}>Save</button>
        </div>
      </div>

      {dialog && (
        <div className="journal-dialog-backdrop">
          <section className="journal-dialog" role="dialog" aria-modal="true" aria-labelledby="journal-dialog-title">
            <header id="journal-dialog-title">
              {dialog === 'help' ? 'Journal Help' : 'Delete Entry'}
            </header>
            <div className="journal-dialog__body">
              <span className="journal-dialog__icon" aria-hidden="true">
                {dialog === 'help' ? '?' : '!'}
              </span>
              <p>
                {dialog === 'help'
                  ? 'Use File > New to start an entry. Save stores it for this session. Use Edit to reopen or delete a saved entry.'
                  : 'Move this saved journal entry to the Recycle Bin? It can be restored until permanently deleted.'}
              </p>
            </div>
            <footer>
              {dialog === 'delete' && (
                <button className="win95-button" type="button" onClick={deleteCurrentEntry}>Move to Recycle Bin</button>
              )}
              <button className="win95-button" type="button" onClick={() => setDialog(null)}>
                {dialog === 'help' ? 'OK' : 'Cancel'}
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}

export default Journal
