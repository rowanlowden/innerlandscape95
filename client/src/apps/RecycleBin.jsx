function formatDeletedAt(date) {
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function entryTitle(entry) {
  const firstLine = entry.content.split('\n').find((line) => line.trim())
  return firstLine?.trim().slice(0, 42) || 'Untitled entry'
}

function RecycleBin({ entries, onRestoreEntry, onPermanentlyDeleteEntry }) {
  return (
    <div className="recycle-bin">
      <header className="recycle-bin__header">
        <div>
          <strong>Recycle Bin</strong>
          <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
        </div>
      </header>
      <div className="recycle-bin__content">
        {entries.length === 0 ? (
          <div className="recycle-bin__empty">
            <strong>The Recycle Bin is empty.</strong>
            <span>Deleted journal entries can be restored here.</span>
          </div>
        ) : (
          <div className="recycle-bin__list">
            {entries.map((item) => (
              <article className="recycle-bin__entry" key={item.entry.id}>
                <div>
                  <strong>{entryTitle(item.entry)}</strong>
                  <span>Deleted {formatDeletedAt(item.deletedAt)}</span>
                </div>
                <div className="recycle-bin__actions">
                  <button className="win95-button" type="button" onClick={() => onRestoreEntry(item.entry.id)}>
                    Restore
                  </button>
                  <button className="win95-button" type="button" onClick={() => onPermanentlyDeleteEntry(item.entry.id)}>
                    Delete permanently
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecycleBin
