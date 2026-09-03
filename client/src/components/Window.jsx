import { useRef, useState } from 'react'

function Window({ title, children, isHidden, onMinimize, onClose }) {
  const [position, setPosition] = useState(() => ({
    x: Math.max(12, Math.min(window.innerWidth - 690, 150)),
    y: Math.max(12, Math.min(window.innerHeight - 480, 72)),
  }))
  const [isMaximized, setIsMaximized] = useState(false)
  const dragState = useRef(null)

  function handlePointerDown(event) {
    if (isMaximized || event.button !== 0 || event.target.closest('button')) return

    dragState.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      windowX: position.x,
      windowY: position.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!dragState.current) return

    const nextX = dragState.current.windowX + event.clientX - dragState.current.pointerX
    const nextY = dragState.current.windowY + event.clientY - dragState.current.pointerY
    setPosition({
      x: Math.max(0, Math.min(nextX, window.innerWidth - 180)),
      y: Math.max(0, Math.min(nextY, window.innerHeight - 68)),
    })
  }

  function stopDragging() {
    dragState.current = null
  }

  return (
    <section
      className={`window ${isMaximized ? 'is-maximized' : ''} ${isHidden ? 'is-hidden' : ''}`}
      style={isMaximized ? undefined : { left: position.x, top: position.y }}
      aria-label={`${title} window`}
    >
      <header
        className="window__titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onDoubleClick={() => setIsMaximized((current) => !current)}
      >
        <div className="window__title">
          <span className="menu-icon menu-icon--journal" aria-hidden="true" />
          <strong>{title}</strong>
        </div>
        <div className="window__controls" onDoubleClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label={`Minimize ${title}`} onClick={onMinimize}>_</button>
          <button
            type="button"
            aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
            onClick={() => setIsMaximized((current) => !current)}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button type="button" aria-label={`Close ${title}`} onClick={onClose}>×</button>
        </div>
      </header>
      <div className="window__content">{children}</div>
    </section>
  )
}

export default Window
