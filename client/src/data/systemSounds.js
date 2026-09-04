let audioContext

const soundPatterns = {
  open: [440, 660],
  save: [660, 880],
  theme: [523, 659, 784],
  minimize: [440, 330],
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    audioContext = new AudioContext()
  }

  return audioContext
}

function playSystemSound(name) {
  const context = getAudioContext()
  const notes = soundPatterns[name]
  if (!context || !notes) return

  if (context.state === 'suspended') context.resume()

  const startTime = context.currentTime
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const noteStart = startTime + index * 0.055

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(frequency, noteStart)
    gain.gain.setValueAtTime(0.025, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.09)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.09)
  })
}

export { playSystemSound }
