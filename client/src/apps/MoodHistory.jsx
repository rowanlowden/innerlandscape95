import { useState } from 'react'
import { feelingGroups } from '../data/feelings'

const ranges = [
  { label: 'Day', days: 1 },
  { label: 'Week', days: 7 },
  { label: '30 Days', days: 30 },
]

const trendRanges = [
  { id: 'week', label: 'Week', days: 7 },
  { id: 'month', label: 'Month', days: 35 },
]

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatTrendLabel(date, range) {
  return new Intl.DateTimeFormat([], range.id === 'week'
    ? { weekday: 'narrow' }
    : { month: 'short', day: 'numeric' }).format(date)
}

function getTrendBuckets(entries, range) {
  const today = startOfDay(new Date())
  const bucketCount = range.id === 'week' ? 7 : 5
  const bucketDays = range.id === 'week' ? 1 : 7
  const start = new Date(today)
  start.setDate(start.getDate() - (range.days - 1))

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = new Date(start)
    bucketStart.setDate(bucketStart.getDate() + (index * bucketDays))
    const bucketEnd = new Date(bucketStart)
    bucketEnd.setDate(bucketEnd.getDate() + bucketDays)
    const counts = feelingGroups.map((group) => ({
      ...group,
      count: entries.filter((entry) => entry.group === group.name
        && entry.loggedAt >= bucketStart && entry.loggedAt < bucketEnd).length,
    }))

    return {
      label: formatTrendLabel(bucketStart, range),
      total: counts.reduce((total, group) => total + group.count, 0),
      counts,
    }
  })
}

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
  const [trendRange, setTrendRange] = useState(trendRanges[0])
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
  const trendBuckets = getTrendBuckets(entries, trendRange)
  const trendMaximum = Math.max(1, ...trendBuckets.map((bucket) => bucket.total))

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
      <section className="mood-history__trends" aria-labelledby="mood-trends-heading">
        <header>
          <strong id="mood-trends-heading">Mood Trends</strong>
          <div className="mood-history__trend-ranges" role="group" aria-label="Mood trend period">
            {trendRanges.map((range) => (
              <button
                className={trendRange.id === range.id ? 'is-selected' : ''}
                key={range.id}
                type="button"
                onClick={() => setTrendRange(range)}
                aria-pressed={trendRange.id === range.id}
              >
                {range.label}
              </button>
            ))}
          </div>
        </header>
        <div
          className="mood-history__trend-chart"
          role="img"
          aria-label={`${trendRange.label} mood pattern chart`}
          style={{ '--trend-columns': trendBuckets.length }}
        >
          {trendBuckets.map((bucket, index) => (
            <div className="mood-history__trend-column" key={`${bucket.label}-${index}`}>
              <div className="mood-history__trend-track" title={`${bucket.label}: ${bucket.total} mood ${bucket.total === 1 ? 'entry' : 'entries'}`}>
                <div className="mood-history__trend-stack" style={{ height: `${(bucket.total / trendMaximum) * 100}%` }}>
                  {bucket.counts.filter((group) => group.count > 0).map((group) => (
                    <span
                      key={group.name}
                      style={{ backgroundColor: group.color, flexGrow: group.count }}
                      title={`${group.shortName}: ${group.count}`}
                    />
                  ))}
                </div>
              </div>
              <span>{bucket.label}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="mood-history__footer">
        Showing the last {selectedRange.label.toLowerCase()} · Stored for this session only
      </div>
    </div>
  )
}

export default MoodHistory
