import { useState } from 'react'
import { feelingGroups } from '../data/feelings'

const ranges = [
  { label: 'Day', days: 1 },
  { label: 'Week', days: 7 },
  { label: '30 Days', days: 30 },
]

function formatLoggedAt(date) {
  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function MoodHistory({ entries }) {
  const [selectedRange, setSelectedRange] = useState(ranges[1])
  const [referenceTime, setReferenceTime] = useState(() => Date.now())
  const rangeStart = referenceTime - selectedRange.days * 24 * 60 * 60 * 1000
  const filteredEntries = entries.filter((entry) => entry.loggedAt.getTime() >= rangeStart)
  const totals = feelingGroups.map((group) => ({
    ...group,
    count: filteredEntries.filter((entry) => entry.group === group.name).length,
  }))
  let chartPosition = 0
  const chartSegments = totals
    .filter((group) => group.count > 0)
    .map((group) => {
      const start = chartPosition
      chartPosition += (group.count / filteredEntries.length) * 100
      return `${group.color} ${start}% ${chartPosition}%`
    })
  const chartStyle = filteredEntries.length > 0
    ? { background: `conic-gradient(${chartSegments.join(', ')})` }
    : undefined

  return (
    <div className="mood-history">
      <header className="mood-history__header">
        <strong>Mood History</strong>
        <div className="mood-history__ranges" aria-label="Mood history time range">
          {ranges.map((range) => (
            <button
              className={selectedRange.days === range.days ? 'is-selected' : ''}
              key={range.days}
              type="button"
              onClick={() => {
                setSelectedRange(range)
                setReferenceTime(Date.now())
              }}
              aria-pressed={selectedRange.days === range.days}
            >
              {range.label}
            </button>
          ))}
        </div>
        <span>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </span>
      </header>
      <div className="mood-history__content">
        <section className="mood-history__summary" aria-label="Mood category chart">
          <div
            className={`mood-history__pie ${filteredEntries.length === 0 ? 'is-empty' : ''}`}
            style={chartStyle}
            role="img"
            aria-label={filteredEntries.length === 0
              ? `No mood data for the last ${selectedRange.label.toLowerCase()}`
              : `Pie chart of mood categories for the last ${selectedRange.label.toLowerCase()}`}
          >
            <span>{filteredEntries.length}</span>
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
          {filteredEntries.length === 0 ? (
            <div className="mood-history__empty">
              No feelings logged in this period.
            </div>
          ) : (
            filteredEntries.map((entry) => (
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
      <div className="mood-history__footer">
        Showing the last {selectedRange.label.toLowerCase()} · Stored for this session only
      </div>
    </div>
  )
}

export default MoodHistory
