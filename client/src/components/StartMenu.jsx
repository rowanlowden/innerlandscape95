const menuItems = [
  { label: 'Journal', icon: 'journal' },
  { label: 'Feelings', icon: 'feelings' },
  { label: 'Thoughts', icon: 'thoughts' },
  { label: 'Mood History', icon: 'history' },
  { label: 'Control Panel', icon: 'control' },
]

function StartMenu({ onOpenJournal }) {
  return (
    <div className="start-menu" role="menu" aria-label="Start menu">
      <div className="start-menu__rail" aria-hidden="true">
        <strong>InnerLandscape</strong><span>95</span>
      </div>
      <div className="start-menu__items">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={item.label === 'Journal' ? onOpenJournal : undefined}
          >
            <span className={`menu-icon menu-icon--${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
            {item.label !== 'Journal' && <span className="start-menu__soon">Soon</span>}
          </button>
        ))}
        <div className="start-menu__divider" />
        <button type="button" role="menuitem">
          <span className="menu-icon menu-icon--shutdown" aria-hidden="true" />
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  )
}

export default StartMenu
