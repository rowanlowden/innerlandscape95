import { useEffect, useMemo, useRef, useState } from 'react'

function formatDate(date) {
  return new Intl.DateTimeFormat([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatTime(date) {
  return new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function entryTitle(entry) {
  const firstLine = entry.content.split('\n').find((line) => line.trim())
  return firstLine?.trim().slice(0, 48) || 'Untitled entry'
}

function Blog({ entries, selectedEntryId, onEditEntry }) {
  const selectedEntryRef = useRef(null)
  const [clickedEntryId, setClickedEntryId] = useState(null)
  const activeEntryId = selectedEntryId || clickedEntryId
  const groupedEntries = useMemo(() => {
    const groups = new Map()

    entries.forEach((entry) => {
      const date = new Date(entry.updatedAt)
      const dateKey = date.toLocaleDateString()
      const group = groups.get(dateKey) || { date, entries: [] }
      group.entries.push(entry)
      groups.set(dateKey, group)
    })

    return [...groups.values()]
  }, [entries])

  useEffect(() => {
    if (!selectedEntryId) return
    selectedEntryRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedEntryId])

  function selectEntry(entry) {
    setClickedEntryId(entry.id)
  }

  return (
    <div className="blog-app">
      <header className="blog-app__header">
        <div>
          <strong>Thoughts Blog</strong>
          <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved</span>
        </div>
        <button className="win95-button" type="button" onClick={() => onEditEntry(activeEntryId)} disabled={!activeEntryId}>
          Edit in Journal
        </button>
      </header>
      <div className="blog-app__content">
        {groupedEntries.length === 0 ? (
          <div className="blog-app__empty">
            <strong>Your blog is empty.</strong>
            <span>Save a journal entry and it will appear here by date.</span>
          </div>
        ) : groupedEntries.map((group) => (
          <section className="blog-day" key={group.date.toISOString()}>
            <h2>{formatDate(group.date)}</h2>
            <div className="blog-day__entries">
              {group.entries.map((entry) => (
                <article
                  className={`blog-entry ${activeEntryId === entry.id ? 'is-selected' : ''}`}
                  key={entry.id}
                  ref={activeEntryId === entry.id ? selectedEntryRef : null}
                  tabIndex="0"
                  onClick={() => selectEntry(entry)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') selectEntry(entry)
                  }}
                >
                  <header>
                    <strong>{entryTitle(entry)}</strong>
                    <time>{formatTime(new Date(entry.updatedAt))}</time>
                  </header>
                  <p>{entry.content}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Blog
