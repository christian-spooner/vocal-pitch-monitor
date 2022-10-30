import './style.css'
import noteFrequencyTable from './core_utils/noteFrequencyTable'
import { setupPitchDetector } from './core_utils/pitchDetector'
import getLogPitchY from './core_utils/getLogPitchY'
import { getContext, setContext } from './core_utils/appContext'
import updateLastPitch from './core_utils/updateLastPitch'

document.querySelector('#app').innerHTML = `
  <div>
    <div>last pitch: <span id="pitch">N/A</span></div>
    <canvas height=1300 />
  </div>
`

const canvasContext = document.querySelector('canvas').getContext('2d')
canvasContext.canvas.width = window.innerWidth

const paintNotesLines = appContext => {
  canvasContext.fillStyle = 'grey'
  canvasContext.font = '10px'

  noteFrequencyTable.forEach(noteFrequencyTuple => {
    const [note, frequency] = noteFrequencyTuple
    const pitchY = getLogPitchY(frequency)(appContext)

    canvasContext.fillText(note, 8, pitchY)
    canvasContext.fillRect(
      appContext.pitchLines.offset.x,
      pitchY,
      canvasContext.canvas.width,
      1
    )
  })
}

const paintMonitorBoard = appContext => {
  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
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
    pitchSize.height
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
