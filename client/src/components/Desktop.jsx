import { useState } from 'react'
import Feelings from '../apps/Feelings'
import Journal from '../apps/Journal'
import MoodHistory from '../apps/MoodHistory'
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
  const [feelingsState, setFeelingsState] = useState('closed')
  const [historyState, setHistoryState] = useState('closed')
  const [moodEntries, setMoodEntries] = useState([])
  const [activeWindow, setActiveWindow] = useState(null)
  const [isStartOpen, setIsStartOpen] = useState(false)

  function openJournal() {
    setJournalState('open')
    setActiveWindow('journal')
    setIsStartOpen(false)
  }

  function openFeelings() {
    setFeelingsState('open')
    setActiveWindow('feelings')
  }

  function openHistory() {
    setHistoryState('open')
    setActiveWindow('history')
  }

  function toggleWindow(id, state, setState) {
    if (state === 'open' && activeWindow === id) {
      setState('minimized')
      setActiveWindow(null)
      return
    }

    setState('open')
    setActiveWindow(id)
  }

  function logFeeling(feeling) {
    setMoodEntries((entries) => [
      {
        id: `${Date.now()}-${entries.length}`,
        name: feeling.name,
        color: feeling.color,
        loggedAt: new Date(),
      },
      ...entries,
    ])
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
            onOpen={
              app.label === 'Journal' ? openJournal
                : app.label === 'Feelings' ? openFeelings
                  : app.label === 'Mood History' ? openHistory
                    : undefined
            }
          />
        ))}
      </div>

      {journalState !== 'closed' && (
        <Window
          title="Journal.exe"
          icon="journal"
          isHidden={journalState === 'minimized'}
          isActive={activeWindow === 'journal'}
          onFocus={() => setActiveWindow('journal')}
          onMinimize={() => {
            setJournalState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setJournalState('closed')
            setActiveWindow(null)
          }}
        >
          <Journal />
        </Window>
      )}

      {feelingsState !== 'closed' && (
        <Window
          title="Feelings Log"
          icon="feelings"
          isHidden={feelingsState === 'minimized'}
          isActive={activeWindow === 'feelings'}
          initialPosition={{ x: 210, y: 90 }}
          onFocus={() => setActiveWindow('feelings')}
          onMinimize={() => {
            setFeelingsState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setFeelingsState('closed')
            setActiveWindow(null)
          }}
        >
          <Feelings onLogFeeling={logFeeling} />
        </Window>
      )}

      {historyState !== 'closed' && (
        <Window
          title="Mood History"
          icon="history"
          isHidden={historyState === 'minimized'}
          isActive={activeWindow === 'history'}
          initialPosition={{ x: 280, y: 120 }}
          onFocus={() => setActiveWindow('history')}
          onMinimize={() => {
            setHistoryState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setHistoryState('closed')
            setActiveWindow(null)
          }}
        >
          <MoodHistory entries={moodEntries} />
        </Window>
      )}

      <div onClick={(event) => event.stopPropagation()}>
        <Taskbar
          isStartOpen={isStartOpen}
          onToggleStart={() => setIsStartOpen((current) => !current)}
          programs={[
            {
              id: 'journal',
              label: 'Journal',
              icon: 'journal',
              state: journalState,
              isActive: journalState === 'open' && activeWindow === 'journal',
              onClick: () => toggleWindow('journal', journalState, setJournalState),
            },
            {
              id: 'feelings',
              label: 'Feelings',
              icon: 'feelings',
              state: feelingsState,
              isActive: feelingsState === 'open' && activeWindow === 'feelings',
              onClick: () => toggleWindow('feelings', feelingsState, setFeelingsState),
            },
            {
              id: 'history',
              label: 'Mood History',
              icon: 'history',
              state: historyState,
              isActive: historyState === 'open' && activeWindow === 'history',
              onClick: () => toggleWindow('history', historyState, setHistoryState),
            },
          ]}
          onOpenJournal={openJournal}
        />
      </div>
    </main>
  )
}

export default Desktop
