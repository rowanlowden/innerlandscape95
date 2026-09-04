const desktopThemes = [
  {
    id: 'teal',
    name: 'Classic Teal',
    description: 'The familiar Windows 95 desktop.',
    color: '#087f7f',
  },
  {
    id: 'cloud',
    name: 'Cloud Blue',
    description: 'A cool blue-gray desktop for long sessions.',
    color: '#4d7594',
  },
  {
    id: 'plum',
    name: 'Plum Dusk',
    description: 'A deep violet desktop with a late-night feel.',
    color: '#60456f',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'A quiet green desktop inspired by CRT palettes.',
    color: '#3f6b58',
  },
]

function ControlPanel({ selectedTheme, onSelectTheme }) {
  return (
    <div className="control-panel">
      <div className="control-panel__header">
        <strong>Desktop Themes</strong>
        <span>Choose a 1995-inspired desktop.</span>
      </div>
      <div className="control-panel__themes" role="radiogroup" aria-label="Desktop themes">
        {desktopThemes.map((theme) => (
          <button
            className={`control-panel__theme ${selectedTheme === theme.id ? 'is-selected' : ''}`}
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selectedTheme === theme.id}
            onClick={() => onSelectTheme(theme.id)}
          >
            <span
              className="control-panel__swatch"
              style={{ backgroundColor: theme.color }}
              aria-hidden="true"
            />
            <span className="control-panel__theme-copy">
              <strong>{theme.name}</strong>
              <span>{theme.description}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="control-panel__status" role="status">
        Current desktop: {desktopThemes.find((theme) => theme.id === selectedTheme)?.name}
      </div>
    </div>
  )
}

export default ControlPanel
