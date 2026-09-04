import { useEffect, useState } from 'react'
import StartMenu from './StartMenu'

function formatTime(date) {
  return new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function Taskbar({ isStartOpen, onToggleStart, programs, onOpenJournal, onOpenBlog }) {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      {isStartOpen && <StartMenu onOpenJournal={onOpenJournal} onOpenBlog={onOpenBlog} />}
      <footer className="taskbar">
        <button
          className={`start-button ${isStartOpen ? 'is-pressed' : ''}`}
          type="button"
          onClick={onToggleStart}
          aria-expanded={isStartOpen}
        >
          <span className="start-button__mark" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <strong>Start</strong>
        </button>
        <div className="taskbar__divider" />
        <div className="taskbar__programs">
          {programs.filter((program) => program.state !== 'closed').map((program) => (
            <button
              key={program.id}
              className={`taskbar__program ${program.isActive ? 'is-active' : ''}`}
              type="button"
              onClick={program.onClick}
            >
              <span className={`menu-icon menu-icon--${program.icon}`} aria-hidden="true" />
              {program.label}
            </button>
          ))}
        </div>
        <div className="taskbar__tray">
          <span className="taskbar__speaker" aria-hidden="true">)))</span>
          <time>{time}</time>
        </div>
      </footer>
    </>
  )
}

export default Taskbar
