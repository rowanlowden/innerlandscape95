function DesktopIcon({ label, icon, onOpen }) {
  return (
    <button className="desktop-icon" type="button" onClick={onOpen}>
      <span className={`desktop-icon__art desktop-icon__art--${icon}`} aria-hidden="true">
        <span />
      </span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  )
}

export default DesktopIcon
