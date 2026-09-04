import { useMemo } from 'react'

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'had', 'has',
  'have', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'so', 'that', 'the',
  'this', 'to', 'was', 'were', 'with', 'you', 'your', 'what', 'when', 'where', 'who', 'why',
])

function weekStart() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 6)
  return start
}

function countBy(items, valueForItem) {
  return items.reduce((counts, item) => {
    const value = valueForItem(item)
    if (!value) return counts
    counts.set(value, (counts.get(value) || 0) + 1)
    return counts
  }, new Map())
}

function highestCounts(counts) {
  const highestCount = Math.max(...counts.values(), 0)
  return [...counts.entries()]
    .filter(([, count]) => count === highestCount)
    .map(([value]) => value)
}

function formatDay(date) {
  return new Intl.DateTimeFormat([], { weekday: 'long', month: 'short', day: 'numeric' }).format(date)
}

function ReflectionSummary({ journalEntries, moodEntries }) {
  const summary = useMemo(() => {
    const start = weekStart()
    const weeklyJournalEntries = journalEntries.filter((entry) => entry.updatedAt >= start)
    const weeklyMoodEntries = moodEntries.filter((entry) => entry.loggedAt >= start)
    const moodCounts = countBy(weeklyMoodEntries, (entry) => entry.name)
    const wordCounts = new Map()

    weeklyJournalEntries.forEach((entry) => {
      const words = entry.content.toLocaleLowerCase().match(/[a-z][a-z'-]*/g) || []
      words.forEach((word) => {
        if (word.length > 2 && !STOP_WORDS.has(word)) {
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
        }
      })
    })

    const dayCounts = countBy(weeklyJournalEntries, (entry) => entry.updatedAt.toDateString())
    const topMood = highestCounts(moodCounts)
    const topWords = [...wordCounts.entries()]
      .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
      .slice(0, 5)
    const topDays = highestCounts(dayCounts).map((day) => formatDay(new Date(day)))
    const topDayCount = Math.max(...dayCounts.values(), 0)

    return { start, weeklyJournalEntries, moodCounts, topMood, topWords, topDays, topDayCount }
  }, [journalEntries, moodEntries])

  return (
    <div className="reflection-summary">
      <header className="reflection-summary__header">
        <div>
          <strong>Reflection Summary</strong>
          <span>Last 7 days, since {formatDay(summary.start)}</span>
        </div>
      </header>
      <div className="reflection-summary__content">
        <section className="reflection-summary__panel">
          <h2>Most common feelings</h2>
          {summary.topMood.length === 0 ? (
            <p>No moods logged this week.</p>
          ) : (
            <>
              <strong>{summary.topMood.join(' and ')}</strong>
              <span>{summary.moodCounts.get(summary.topMood[0])} {summary.moodCounts.get(summary.topMood[0]) === 1 ? 'check-in' : 'check-ins'}</span>
            </>
          )}
        </section>
        <section className="reflection-summary__panel">
          <h2>Words appearing often</h2>
          {summary.topWords.length === 0 ? (
            <p>No repeated journal words this week.</p>
          ) : (
            <div className="reflection-summary__words">
              {summary.topWords.map(([word, count]) => <span key={word}>{word} <strong>{count}</strong></span>)}
            </div>
          )}
        </section>
        <section className="reflection-summary__panel">
          <h2>Most journaling</h2>
          {summary.topDays.length === 0 ? (
            <p>No journal entries saved this week.</p>
          ) : (
            <>
              <strong>{summary.topDays.join(' and ')}</strong>
              <span>{summary.topDayCount} {summary.topDayCount === 1 ? 'entry' : 'entries'} saved on that day</span>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default ReflectionSummary
