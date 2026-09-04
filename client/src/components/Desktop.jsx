import { useEffect, useState } from 'react'
import Blog from '../apps/Blog'
import ControlPanel from '../apps/ControlPanel'
import Feelings from '../apps/Feelings'
import Journal from '../apps/Journal'
import MoodHistory from '../apps/MoodHistory'
import RecycleBin from '../apps/RecycleBin'
import ReflectionSummary from '../apps/ReflectionSummary'
import { readEntries, readValue, STORAGE_KEYS, writeValue } from '../data/localStorage'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

const desktopApps = [
  { label: 'Journal', icon: 'journal' },
  { label: 'Blog', icon: 'thoughts' },
  { label: 'Feelings', icon: 'feelings' },
  { label: 'Mood History', icon: 'history' },
  { label: 'Control Panel', icon: 'control' },
  { label: 'Reflection Summary', icon: 'reflection' },
  { label: 'Recycle Bin', icon: 'recycle' },
]

function readDeletedJournalEntries() {
  const deletedEntries = readValue(STORAGE_KEYS.deletedJournalEntries, [])
  if (!Array.isArray(deletedEntries)) return []

  return deletedEntries
    .filter((item) => item?.entry)
    .map((item) => ({
      ...item,
      deletedAt: new Date(item.deletedAt),
      entry: {
        ...item.entry,
        createdAt: new Date(item.entry.createdAt),
        updatedAt: new Date(item.entry.updatedAt),
      },
    }))
}

function Desktop() {
  const [journalState, setJournalState] = useState('closed')
  const [feelingsState, setFeelingsState] = useState('closed')
  const [blogState, setBlogState] = useState('closed')
  const [historyState, setHistoryState] = useState('closed')
  const [controlPanelState, setControlPanelState] = useState('closed')
  const [recycleBinState, setRecycleBinState] = useState('closed')
  const [reflectionState, setReflectionState] = useState('closed')
  const [desktopTheme, setDesktopTheme] = useState(() => readValue(STORAGE_KEYS.desktopTheme, 'teal'))
  const [desktopIconSize, setDesktopIconSize] = useState(() => readValue(STORAGE_KEYS.desktopIconSize, 'medium'))
  const [moodEntries, setMoodEntries] = useState(() => readEntries(
    STORAGE_KEYS.moodEntries,
    ['loggedAt'],
  ))
  const [journalEntries, setJournalEntries] = useState(() => readEntries(
    STORAGE_KEYS.journalEntries,
    ['createdAt', 'updatedAt'],
  ))
  const [deletedJournalEntries, setDeletedJournalEntries] = useState(readDeletedJournalEntries)
  const [selectedBlogEntryId, setSelectedBlogEntryId] = useState(null)
  const [journalEntryToEdit, setJournalEntryToEdit] = useState(null)
  const [journalMood, setJournalMood] = useState(null)
  const [isPickingJournalMood, setIsPickingJournalMood] = useState(false)
  const [activeWindow, setActiveWindow] = useState(null)
  const [isStartOpen, setIsStartOpen] = useState(false)

  useEffect(() => {
    writeValue(STORAGE_KEYS.desktopTheme, desktopTheme)
  }, [desktopTheme])

  useEffect(() => {
    writeValue(STORAGE_KEYS.desktopIconSize, desktopIconSize)
  }, [desktopIconSize])

  useEffect(() => {
    writeValue(STORAGE_KEYS.moodEntries, moodEntries)
  }, [moodEntries])

  useEffect(() => {
    writeValue(STORAGE_KEYS.journalEntries, journalEntries)
  }, [journalEntries])

  useEffect(() => {
    writeValue(STORAGE_KEYS.deletedJournalEntries, deletedJournalEntries)
  }, [deletedJournalEntries])

  function openJournal() {
    setJournalState('open')
    setJournalEntryToEdit(null)
    setJournalMood(null)
    setActiveWindow('journal')
    setIsStartOpen(false)
  }

  function openJournalEntry(id) {
    const savedEntry = journalEntries.find((entry) => entry.id === id)
    setJournalState('open')
    setJournalEntryToEdit(id)
    setJournalMood(savedEntry?.mood || null)
    setActiveWindow('journal')
  }

  function openFeelings() {
    setFeelingsState('open')
    setIsPickingJournalMood(false)
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

  function openRecycleBin() {
    setRecycleBinState('open')
    setActiveWindow('recycle-bin')
    setIsStartOpen(false)
  }

  function openReflectionSummary() {
    setReflectionState('open')
    setActiveWindow('reflection-summary')
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

  function openJournalMoodPicker() {
    setIsPickingJournalMood(true)
    setFeelingsState('open')
    setActiveWindow('feelings')
  }

  function selectJournalMood(feeling) {
    setJournalMood(feeling)
    setIsPickingJournalMood(false)
    setFeelingsState('minimized')
    setActiveWindow('journal')
  }

  function syncJournalMood(entry) {
    setMoodEntries((entries) => {
      const remainingEntries = entries.filter((moodEntry) => moodEntry.journalEntryId !== entry.id)
      if (!entry.mood) return remainingEntries

      return [
        {
          id: `journal-${entry.id}`,
          ...entry.mood,
          loggedAt: entry.updatedAt,
          journalEntryId: entry.id,
        },
        ...remainingEntries,
      ]
    })
  }

  function createJournalEntry(content, mood) {
    const savedEntry = {
      id: `${Date.now()}-${journalEntries.length}`,
      content,
      mood,
      theme: desktopTheme,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setJournalEntries((entries) => [savedEntry, ...entries])
    syncJournalMood(savedEntry)
    return savedEntry
  }

  function updateJournalEntry(id, content, mood) {
    const updatedAt = new Date()
    const updatedEntry = { id, content, mood, updatedAt }
    setJournalEntries((entries) => entries.map((entry) =>
      entry.id === id ? { ...entry, content, mood, updatedAt } : entry,
    ))
    syncJournalMood(updatedEntry)
  }

  function deleteJournalEntry(id) {
    const deletedEntry = journalEntries.find((entry) => entry.id === id)
    if (!deletedEntry) return

    setJournalEntries((entries) => entries.filter((entry) => entry.id !== id))
    setMoodEntries((entries) => entries.filter((entry) => entry.journalEntryId !== id))
    setDeletedJournalEntries((entries) => [
      { entry: deletedEntry, deletedAt: new Date() },
      ...entries.filter((item) => item.entry.id !== id),
    ])
  }

  function restoreJournalEntry(id) {
    const recycledEntry = deletedJournalEntries.find((item) => item.entry.id === id)
    if (!recycledEntry) return

    setJournalEntries((entries) => [
      recycledEntry.entry,
      ...entries.filter((entry) => entry.id !== id),
    ])
    setDeletedJournalEntries((entries) => entries.filter((item) => item.entry.id !== id))
    syncJournalMood(recycledEntry.entry)
  }

  function permanentlyDeleteJournalEntry(id) {
    setDeletedJournalEntries((entries) => entries.filter((item) => item.entry.id !== id))
  }

  return (
    <main className={`desktop desktop--${desktopTheme} desktop--icons-${desktopIconSize}`} onClick={() => isStartOpen && setIsStartOpen(false)}>
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
                        : app.label === 'Reflection Summary' ? openReflectionSummary
                          : app.label === 'Recycle Bin' ? openRecycleBin
                            : undefined
            }
          />
        ))}
      </div>

      <aside className="desktop__check-in" aria-label="Daily check-in">
        <strong>Daily Check-In</strong>
        <span>Make space for one thought.</span>
        <button className="win95-button" type="button" onClick={openJournal}>Write now</button>
      </aside>

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
            key={journalEntryToEdit || 'new-entry'}
            entries={journalEntries}
            initialEntryId={journalEntryToEdit}
            selectedMood={journalMood}
            onSelectMood={openJournalMoodPicker}
            onClearMood={() => setJournalMood(null)}
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
            setIsPickingJournalMood(false)
            setActiveWindow(null)
          }}
        >
          <Feelings
            onLogFeeling={logFeeling}
            onSelectJournalMood={isPickingJournalMood ? selectJournalMood : undefined}
            selectedJournalMood={isPickingJournalMood ? journalMood : undefined}
          />
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
          <ControlPanel
            selectedTheme={desktopTheme}
            onSelectTheme={setDesktopTheme}
            iconSize={desktopIconSize}
            onSelectIconSize={setDesktopIconSize}
          />
        </Window>
      )}

      {recycleBinState !== 'closed' && (
        <Window
          title="Recycle Bin"
          icon="recycle"
          isHidden={recycleBinState === 'minimized'}
          isActive={activeWindow === 'recycle-bin'}
          initialPosition={{ x: 350, y: 120 }}
          onFocus={() => setActiveWindow('recycle-bin')}
          onMinimize={() => {
            setRecycleBinState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setRecycleBinState('closed')
            setActiveWindow(null)
          }}
        >
          <RecycleBin
            entries={deletedJournalEntries}
            onRestoreEntry={restoreJournalEntry}
            onPermanentlyDeleteEntry={permanentlyDeleteJournalEntry}
          />
        </Window>
      )}

      {reflectionState !== 'closed' && (
        <Window
          title="Reflection Summary"
          icon="reflection"
          isHidden={reflectionState === 'minimized'}
          isActive={activeWindow === 'reflection-summary'}
          initialPosition={{ x: 250, y: 100 }}
          onFocus={() => setActiveWindow('reflection-summary')}
          onMinimize={() => {
            setReflectionState('minimized')
            setActiveWindow(null)
          }}
          onClose={() => {
            setReflectionState('closed')
            setActiveWindow(null)
          }}
        >
          <ReflectionSummary journalEntries={journalEntries} moodEntries={moodEntries} />
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
            {
              id: 'recycle-bin',
              label: 'Recycle Bin',
              icon: 'recycle',
              state: recycleBinState,
              isActive: recycleBinState === 'open' && activeWindow === 'recycle-bin',
              onClick: () => toggleWindow('recycle-bin', recycleBinState, setRecycleBinState),
            },
            {
              id: 'reflection-summary',
              label: 'Reflection Summary',
              icon: 'reflection',
              state: reflectionState,
              isActive: reflectionState === 'open' && activeWindow === 'reflection-summary',
              onClick: () => toggleWindow('reflection-summary', reflectionState, setReflectionState),
            },
          ]}
          onOpenJournal={openJournal}
        />
      </div>
    </main>
  )
}

export default Desktop
