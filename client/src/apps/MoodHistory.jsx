import { feelingGroups } from '../data/feelings'

function formatLoggedAt(date) {
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function MoodHistory({ entries }) {
  const totals = feelingGroups.map((group) => ({
    ...group,
    count: entries.filter((entry) => entry.group === group.name).length,
  }))
  let chartPosition = 0
  const chartSegments = totals
    .filter((group) => group.count > 0)
    .map((group) => {
      const start = chartPosition
      chartPosition += (group.count / entries.length) * 100
      return `${group.color} ${start}% ${chartPosition}%`
    })
  const chartStyle = entries.length > 0
    ? { background: `conic-gradient(${chartSegments.join(', ')})` }
    : undefined

  return (
    <div className="mood-history">
      <header className="mood-history__header">
        <strong>Mood History</strong>
        <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
      </header>
      <div className="mood-history__content">
        <section className="mood-history__summary" aria-label="Mood category chart">
          <div
            className={`mood-history__pie ${entries.length === 0 ? 'is-empty' : ''}`}
            style={chartStyle}
            role="img"
            aria-label={entries.length === 0 ? 'No mood data yet' : 'Pie chart of logged mood categories'}
          >
            <span>{entries.length}</span>
          </div>
          <div className="mood-history__legend">
            {totals.map((group) => (
              <div key={group.name}>
                <span style={{ backgroundColor: group.color }} aria-hidden="true" />
                <span>{group.shortName}</span>
                <strong>{group.count}</strong>
              </div>
            ))}
          </div>
        </section>
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
                <div>
                  <strong>{entry.name}</strong>
                  <span>{entry.groupLabel}</span>
                </div>
                <time dateTime={entry.loggedAt.toISOString()}>
                  {formatLoggedAt(entry.loggedAt)}
                </time>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mood-history__footer">Stored for this session only</div>
    </div>
  )
}

export default MoodHistory
