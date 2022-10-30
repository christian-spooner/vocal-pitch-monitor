import noteFrequencyTable from './noteFrequencyTable'

const firstNoteFrequency = noteFrequencyTable[0][1]
const lastNoteFrequency = noteFrequencyTable.at(-1)[1]

const getLogPitchY = frequency => appContext =>
  appContext.pitchLines.highestOnTop
    ? Math.log2(lastNoteFrequency) * appContext.pitchLines.baseDistance -
      Math.log2(frequency) * appContext.pitchLines.baseDistance +
      appContext.pitchLines.offset.y
    : Math.log2(frequency) * appContext.pitchLines.baseDistance -
      Math.log2(firstNoteFrequency) * appContext.pitchLines.baseDistance +
      appContext.pitchLines.offset.y

export default getLogPitchY
