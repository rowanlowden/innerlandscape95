function formatLoggedAt(date) {
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function MoodHistory({ entries }) {
  return (
    <div className="mood-history">
      <header className="mood-history__header">
        <strong>Mood History</strong>
        <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
      </header>
      <div className="mood-history__list" role="log" aria-label="Logged feelings">
        {entries.length === 0 ? (
          <div className="mood-history__empty">
            No feelings logged. Open Feelings to add one.
          </div>
        ) : (
          entries.map((entry) => (
            <div className="mood-history__entry" key={entry.id}>
              <span
                className="mood-history__swatch"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <strong>{entry.name}</strong>
              <time dateTime={entry.loggedAt.toISOString()}>
                {formatLoggedAt(entry.loggedAt)}
              </time>
            </div>
          ))
        )}
      </div>
      <div className="mood-history__footer">Stored for this session only</div>
    </div>
  )
}

export default MoodHistory
