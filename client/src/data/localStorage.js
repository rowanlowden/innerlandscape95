const STORAGE_KEYS = {
  journalEntries: 'innerlandscape95.journalEntries',
  moodEntries: 'innerlandscape95.moodEntries',
  desktopTheme: 'innerlandscape95.desktopTheme',
  desktopIconSize: 'innerlandscape95.desktopIconSize',
  systemSoundsEnabled: 'innerlandscape95.systemSoundsEnabled',
  deletedJournalEntries: 'innerlandscape95.deletedJournalEntries',
}

function readValue(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

function writeValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
  }
}

function readEntries(key, dateFields) {
  const entries = readValue(key, [])
  if (!Array.isArray(entries)) return []

  return entries.map((entry) => dateFields.reduce((restoredEntry, field) => ({
    ...restoredEntry,
    [field]: new Date(entry[field]),
  }), entry))
}

export {
  STORAGE_KEYS,
  readEntries,
  readValue,
  writeValue,
}
