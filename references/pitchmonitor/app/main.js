import './style.css'
import noteFrequencyTuples from './constants/noteFrequencyTuples'
import { setupPitchDetector } from './audio/pitchDetector'
import getLogPitchY from './core/getLogPitchY'
import { getContext, setContext } from './core/appContext'
import updateLastPitch from './core/updateLastPitch'
import logoUrl from '../public/pitchmonitor.svg'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Pitch Monitor <img src="${logoUrl}" height="48" width="48"></h1>
    <div>last pitch: <span id="pitch">N/A</span></div>
    <canvas height=1300 />
  </div>
`

const canvasContext = document.querySelector('canvas').getContext('2d')
// make canvas responsive
canvasContext.canvas.width = window.innerWidth

const paintNotesLines = appContext => {
  canvasContext.fillStyle = 'blue'
  canvasContext.font = '10px'

  noteFrequencyTuples.forEach(noteFrequencyTuple => {
    const [note, frequency] = noteFrequencyTuple
    const pitchY = getLogPitchY(frequency)(appContext)

    canvasContext.fillText(note, 8, pitchY)
    canvasContext.fillRect(
      appContext.pitchLines.offset.x,
      pitchY,
      canvasContext.canvas.width,
      1,
    )
  })
}

const paintMonitorBoard = appContext => {
  canvasContext.fillStyle = 'white'
  canvasContext.fillRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height,
  )
  paintNotesLines(appContext)
}

const paintLastPitch = appContext => {
  const { lastPitch, pitchSize, pitchLines } = appContext

  if (lastPitch.position.x === pitchLines.offset.x) {
    paintMonitorBoard(appContext)
  }

  canvasContext.fillStyle = lastPitch.color
  canvasContext.fillRect(
    lastPitch.position.x,
    lastPitch.position.y,
    pitchSize.width,
    pitchSize.height,
  )
}

paintMonitorBoard(getContext())

setupPitchDetector().then(pitchDetector => {
  pitchDetector.addPitchListener(frequency => {
    document.getElementById('pitch').innerHTML = frequency

    setContext(updateLastPitch(frequency, canvasContext.canvas.width)(getContext()))

    paintLastPitch(getContext())
  })
})
