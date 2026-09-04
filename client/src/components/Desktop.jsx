import { useState } from 'react'
import Blog from '../apps/Blog'
import ControlPanel from '../apps/ControlPanel'
import Feelings from '../apps/Feelings'
import Journal from '../apps/Journal'
import MoodHistory from '../apps/MoodHistory'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

const desktopApps = [
  { label: 'Journal', icon: 'journal' },
  { label: 'Blog', icon: 'thoughts' },
  { label: 'Feelings', icon: 'feelings' },
  { label: 'Mood History', icon: 'history' },
  { label: 'Control Panel', icon: 'control' },
  { label: 'Recycle Bin', icon: 'recycle' },
]

function Desktop() {
  const [journalState, setJournalState] = useState('closed')
  const [feelingsState, setFeelingsState] = useState('closed')
  const [blogState, setBlogState] = useState('closed')
  const [historyState, setHistoryState] = useState('closed')
  const [controlPanelState, setControlPanelState] = useState('closed')
  const [desktopTheme, setDesktopTheme] = useState('teal')
  const [moodEntries, setMoodEntries] = useState([])
  const [journalEntries, setJournalEntries] = useState([])
  const [selectedBlogEntryId, setSelectedBlogEntryId] = useState(null)
  const [journalEntryToEdit, setJournalEntryToEdit] = useState(null)
  const [activeWindow, setActiveWindow] = useState(null)
  const [isStartOpen, setIsStartOpen] = useState(false)

  function openJournal() {
    setJournalState('open')
    setJournalEntryToEdit(null)
    setActiveWindow('journal')
    setIsStartOpen(false)
  }

  function openJournalEntry(id) {
    setJournalState('open')
    setJournalEntryToEdit(id)
    setActiveWindow('journal')
  }

  function openFeelings() {
    setFeelingsState('open')
    setActiveWindow('feelings')
  }

  function openHistory() {
    setHistoryState('open')
    setActiveWindow('history')
  }

  function openBlog(entryId = null) {
    setBlogState('open')
    setSelectedBlogEntryId(entryId)
    setActiveWindow('blog')
    setIsStartOpen(false)
  }

  function openControlPanel() {
    setControlPanelState('open')
    setActiveWindow('control-panel')
    setIsStartOpen(false)
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
        group: feeling.group,
        groupLabel: feeling.groupLabel,
        color: feeling.color,
        loggedAt: new Date(),
      },
      ...entries,
    ])
  }

  function createJournalEntry(content) {
    const savedEntry = {
      id: `${Date.now()}-${journalEntries.length}`,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setJournalEntries((entries) => [savedEntry, ...entries])
    return savedEntry
  }

  function updateJournalEntry(id, content) {
    setJournalEntries((entries) => entries.map((entry) =>
      entry.id === id ? { ...entry, content, updatedAt: new Date() } : entry,
    ))
  }

  function deleteJournalEntry(id) {
    setJournalEntries((entries) => entries.filter((entry) => entry.id !== id))
  }

  return (
    <main className={`desktop desktop--${desktopTheme}`} onClick={() => isStartOpen && setIsStartOpen(false)}>
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
                    : app.label === 'Blog' ? () => openBlog()
                      : app.label === 'Mood History' ? openHistory
                      : app.label === 'Control Panel' ? openControlPanel
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
          <Journal
          onOpenBlog={() => openBlog()}
            key={journalEntryToEdit || 'new-entry'}
            entries={journalEntries}
            initialEntryId={journalEntryToEdit}
            onCreateEntry={createJournalEntry}
            onUpdateEntry={updateJournalEntry}
            onDeleteEntry={deleteJournalEntry}
            onOpenSavedEntry={openBlog}
          />
        </Window>
      )}

      {blogState !== 'closed' && (
        <Window
          title="Thoughts Blog"
          icon="thoughts"
          isHidden={blogState === 'minimized'}
          isActive={activeWindow === 'blog'}
          initialPosition={{ x: 230, y: 80 }}
          onFocus={() => setActiveWindow('blog')}
          onMinimize={() => {
            setBlogState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setBlogState('closed')
            setActiveWindow(null)
          }}
        >
          <Blog
            entries={journalEntries}
            selectedEntryId={selectedBlogEntryId}
            onEditEntry={openJournalEntry}
          />
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

      {controlPanelState !== 'closed' && (
        <Window
          title="Control Panel"
          icon="control"
          isHidden={controlPanelState === 'minimized'}
          isActive={activeWindow === 'control-panel'}
          initialPosition={{ x: 320, y: 100 }}
          onFocus={() => setActiveWindow('control-panel')}
          onMinimize={() => {
            setControlPanelState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setControlPanelState('closed')
            setActiveWindow(null)
          }}
        >
          <ControlPanel selectedTheme={desktopTheme} onSelectTheme={setDesktopTheme} />
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
              id: 'blog',
              label: 'Blog',
              icon: 'thoughts',
              state: blogState,
              isActive: blogState === 'open' && activeWindow === 'blog',
              onClick: () => toggleWindow('blog', blogState, setBlogState),
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
