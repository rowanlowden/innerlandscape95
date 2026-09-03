import { useState } from 'react'
import Journal from '../apps/Journal'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

const desktopApps = [
  { label: 'Journal', icon: 'journal' },
  { label: 'Feelings', icon: 'feelings' },
  { label: 'Thoughts', icon: 'thoughts' },
  { label: 'Mood History', icon: 'history' },
  { label: 'Control Panel', icon: 'control' },
  { label: 'Recycle Bin', icon: 'recycle' },
]

function Desktop() {
  const [journalState, setJournalState] = useState('closed')
  const [isStartOpen, setIsStartOpen] = useState(false)

  function openJournal() {
    setJournalState('open')
    setIsStartOpen(false)
  }

  function handleTaskbarJournalClick() {
    setJournalState((current) => current === 'open' ? 'minimized' : 'open')
  }

  return (
    <main className="desktop" onClick={() => isStartOpen && setIsStartOpen(false)}>
      <div className="desktop__texture" aria-hidden="true" />
      <div className="desktop__icons" aria-label="Desktop programs">
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.label}
            label={app.label}
            icon={app.icon}
            onOpen={app.label === 'Journal' ? openJournal : undefined}
          />
        ))}
      </div>

      {journalState !== 'closed' && (
        <Window
          title="Journal.exe"
          isHidden={journalState === 'minimized'}
          onMinimize={() => setJournalState('minimized')}
          onClose={() => setJournalState('closed')}
        >
          <Journal />
        </Window>
      )}

      <div onClick={(event) => event.stopPropagation()}>
        <Taskbar
          isStartOpen={isStartOpen}
          onToggleStart={() => setIsStartOpen((current) => !current)}
          journalState={journalState}
          onJournalClick={handleTaskbarJournalClick}
          onOpenJournal={openJournal}
        />
      </div>
    </main>
  )
}

export default Desktop
