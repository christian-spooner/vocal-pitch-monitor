import noteFrequencyTable from './noteFrequencyTable'
import getLogPitchY from './getLogPitchY'

const isNearNote = frequency =>
  noteFrequencyTable.some(noteFrequencyTable => {
    // eslint-disable-next-line no-unused-vars
    const [_, expectedFrequency] = noteFrequencyTable
    const frequencyDiff = Math.abs(expectedFrequency - frequency)

    /**
     * around 10% of the ratio between
     * the difference between the frequencies
     * of two adjacent notes and one of those frequencies
     */
    const threshold = 0.017

    return frequencyDiff <= threshold * expectedFrequency
  })

const updateLastPitch = (frequency, canvasWidth) => appContext => {
  const { lastPitch, pitchSize, pitchLines } = appContext
  const newPitchX =
    lastPitch.position.x < pitchLines.offset.x
      ? pitchLines.offset.x
      : lastPitch.position.x + pitchSize.width

  return {
    ...appContext,
    lastPitch: {
      position: {
        x: newPitchX > canvasWidth ? pitchLines.offset.x : newPitchX,
        y: getLogPitchY(frequency)(appContext) - pitchSize.height / 2
      },
      color: isNearNote(frequency) ? 'green' : 'red'
    }
  }
}

export default updateLastPitch
