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
  {
    id: 'lofi-rainy-window',
    name: 'Rainy Window',
    description: 'A blue city scene for a mellow writing session.',
    color: '#31567a',
    image: '/themes/lofi-rainy-window.svg',
  },
  {
    id: 'lofi-dusk-mountains',
    name: 'Dusk Mountains',
    description: 'A warm mountain horizon with a quiet lake.',
    color: '#c47b70',
    image: '/themes/lofi-dusk-mountains.svg',
  },
]

const iconSizes = [
  { id: 'small', name: 'Small' },
  { id: 'medium', name: 'Medium' },
  { id: 'large', name: 'Large' },
]

function ControlPanel({
  selectedTheme,
  onSelectTheme,
  iconSize,
  onSelectIconSize,
  systemSoundsEnabled,
  onToggleSystemSounds,
}) {
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
              style={{
                backgroundColor: theme.color,
                backgroundImage: theme.image ? `url(${theme.image})` : undefined,
              }}
              aria-hidden="true"
            />
            <span className="control-panel__theme-copy">
              <strong>{theme.name}</strong>
              <span>{theme.description}</span>
            </span>
          </button>
        ))}
      </div>
      <section className="control-panel__icon-size" aria-labelledby="icon-size-heading">
        <strong id="icon-size-heading">Desktop Icon Size</strong>
        <div role="radiogroup" aria-label="Desktop icon size">
          {iconSizes.map((size) => (
            <button
              className={iconSize === size.id ? 'is-selected' : ''}
              key={size.id}
              type="button"
              role="radio"
              aria-checked={iconSize === size.id}
              onClick={() => onSelectIconSize(size.id)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </section>
      <label className="control-panel__sound-setting">
        <span>
          <strong>Classic System Sounds</strong>
          <span>Play subtle sounds for desktop actions.</span>
        </span>
        <input
          type="checkbox"
          checked={systemSoundsEnabled}
          onChange={(event) => onToggleSystemSounds(event.target.checked)}
        />
      </label>
      <div className="control-panel__status" role="status">
        Current desktop: {desktopThemes.find((theme) => theme.id === selectedTheme)?.name} · {iconSizes.find((size) => size.id === iconSize)?.name} icons · Sounds {systemSoundsEnabled ? 'on' : 'off'}
      </div>
    </div>
  )
}

export default ControlPanel
