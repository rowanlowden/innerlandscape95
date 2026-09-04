import { useEffect, useMemo, useRef, useState } from 'react'

const DATE_RANGES = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
}

const THEMES = [
  { id: 'teal', name: 'Classic Teal' },
  { id: 'cloud', name: 'Cloud Blue' },
  { id: 'plum', name: 'Plum Dusk' },
  { id: 'forest', name: 'Forest Green' },
  { id: 'lofi-rainy-window', name: 'Rainy Window' },
  { id: 'lofi-dusk-mountains', name: 'Dusk Mountains' },
]

function dateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateFromInput(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function rangeBounds(date, range) {
  const start = startOfDay(date)

  if (range === 'week') {
    const dayOffset = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - dayOffset)
  }

  if (range === 'month') {
    start.setDate(1)
  }

  const end = new Date(start)
  if (range === 'day') end.setDate(end.getDate() + 1)
  if (range === 'week') end.setDate(end.getDate() + 7)
  if (range === 'month') end.setMonth(end.getMonth() + 1)

  return { start, end }
}

function shiftDate(date, range, direction) {
  const nextDate = new Date(date)
  if (range === 'day') nextDate.setDate(nextDate.getDate() + direction)
  if (range === 'week') nextDate.setDate(nextDate.getDate() + (direction * 7))
  if (range === 'month') nextDate.setMonth(nextDate.getMonth() + direction)
  return nextDate
}

function rangeLabel(date, range) {
  const { start, end } = rangeBounds(date, range)

  if (range === 'day') return formatDate(start)
  if (range === 'month') {
    return new Intl.DateTimeFormat([], { month: 'long', year: 'numeric' }).format(start)
  }

  const lastDay = new Date(end)
  lastDay.setDate(lastDay.getDate() - 1)
  const formatter = new Intl.DateTimeFormat([], { month: 'short', day: 'numeric' })
  return `${formatter.format(start)} - ${formatter.format(lastDay)}`
}

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
  const [dateRange, setDateRange] = useState('month')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchText, setSearchText] = useState('')
  const [moodFilter, setMoodFilter] = useState('all')
  const [themeFilter, setThemeFilter] = useState('all')
  const activeEntryId = selectedEntryId || clickedEntryId
  const moods = useMemo(() => [...new Set(entries.flatMap((entry) => entry.mood?.name || []))], [entries])
  const groupedEntries = useMemo(() => {
    const groups = new Map()
    const { start, end } = rangeBounds(selectedDate, dateRange)
    const normalizedSearch = searchText.trim().toLocaleLowerCase()

    entries.forEach((entry) => {
      const date = new Date(entry.updatedAt)
      if (date < start || date >= end) return
      if (normalizedSearch && !entry.content.toLocaleLowerCase().includes(normalizedSearch)) return
      if (moodFilter !== 'all' && entry.mood?.name !== moodFilter) return
      if (themeFilter !== 'all' && entry.theme !== themeFilter) return

      const dateKey = dateInputValue(date)
      const group = groups.get(dateKey) || { date, entries: [] }
      group.entries.push(entry)
      groups.set(dateKey, group)
    })

    return [...groups.values()]
  }, [dateRange, entries, moodFilter, searchText, selectedDate, themeFilter])

  const shownEntryCount = groupedEntries.reduce((count, group) => count + group.entries.length, 0)
  const hasExtraFilters = searchText.trim() || moodFilter !== 'all' || themeFilter !== 'all'

  useEffect(() => {
    if (!selectedEntryId) return
    selectedEntryRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedEntryId])

  useEffect(() => {
    const selectedEntry = entries.find((entry) => entry.id === selectedEntryId)
    if (selectedEntry) setSelectedDate(new Date(selectedEntry.updatedAt))
  }, [entries, selectedEntryId])

  function selectEntry(entry) {
    setClickedEntryId(entry.id)
  }

  function changeSelectedDate(value) {
    setSelectedDate(dateFromInput(value))
    setClickedEntryId(null)
  }

  return (
    <div className="blog-app">
      <header className="blog-app__header">
        <div>
          <strong>Thoughts Blog</strong>
          <span>{shownEntryCount} of {entries.length} {entries.length === 1 ? 'entry' : 'entries'} shown</span>
        </div>
        <button className="win95-button" type="button" onClick={() => onEditEntry(activeEntryId)} disabled={!activeEntryId}>
          Edit in Journal
        </button>
      </header>
      <div className="blog-app__navigator" aria-label="Blog date navigator">
        <div className="blog-app__ranges" role="group" aria-label="Date range">
          {Object.entries(DATE_RANGES).map(([range, label]) => (
            <button
              className={dateRange === range ? 'is-selected' : ''}
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="blog-app__date-controls">
          <button
            className="win95-button blog-app__date-button"
            type="button"
            aria-label={`Previous ${dateRange}`}
            title={`Previous ${dateRange}`}
            onClick={() => changeSelectedDate(dateInputValue(shiftDate(selectedDate, dateRange, -1)))}
          >
            &lt;
          </button>
          <label>
            <input
              aria-label="Jump to date"
              type="date"
              value={dateInputValue(selectedDate)}
              onChange={(event) => changeSelectedDate(event.target.value)}
            />
          </label>
          <button
            className="win95-button blog-app__date-button"
            type="button"
            aria-label={`Next ${dateRange}`}
            title={`Next ${dateRange}`}
            onClick={() => changeSelectedDate(dateInputValue(shiftDate(selectedDate, dateRange, 1)))}
          >
            &gt;
          </button>
        </div>
        <strong className="blog-app__range-label">{rangeLabel(selectedDate, dateRange)}</strong>
        <div className="blog-app__filters" aria-label="Blog filters">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search journal text"
            aria-label="Search journal text"
          />
          <select value={moodFilter} onChange={(event) => setMoodFilter(event.target.value)} aria-label="Filter by mood">
            <option value="all">All moods</option>
            {moods.map((mood) => <option key={mood} value={mood}>{mood}</option>)}
          </select>
          <select value={themeFilter} onChange={(event) => setThemeFilter(event.target.value)} aria-label="Filter by saved theme">
            <option value="all">All themes</option>
            {THEMES.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
          </select>
        </div>
      </div>
      <div className="blog-app__content">
        {groupedEntries.length === 0 ? (
          <div className="blog-app__empty">
            <strong>{entries.length === 0 ? 'Your blog is empty.' : hasExtraFilters ? 'No entries match these filters.' : 'No entries in this period.'}</strong>
            <span>{entries.length === 0 ? 'Save a journal entry and it will appear here by date.' : hasExtraFilters ? 'Adjust the search or filters to see more entries.' : 'Choose another date or range to view saved entries.'}</span>
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
                    <div className="blog-entry__meta">
                      {entry.mood && (
                        <span className="blog-entry__mood" title={entry.mood.name}>
                          <span style={{ backgroundColor: entry.mood.color }} aria-hidden="true" />
                          {entry.mood.name}
                        </span>
                      )}
                      <time>{formatTime(new Date(entry.updatedAt))}</time>
                    </div>
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
