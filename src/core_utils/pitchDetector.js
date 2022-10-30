import * as pitchfinder from 'pitchfinder'
import noteFrequencyTable from './noteFrequencyTable'

export const setupPitchDetector = async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(mediaStream)
  const node = audioContext.createScriptProcessor(0, 1, 1)
  source.connect(node)
  node.connect(audioContext.destination)

  const pitchListeners = []
  node.onaudioprocess = data => {
    const channelData = data.inputBuffer.getChannelData(0)

    const frequency = pitchfinder.AMDF({
      minFrequency: noteFrequencyTable[0][1],
      sampleRate: audioContext.sampleRate,
      maxFrequency: noteFrequencyTable.at(-1)[1]
    })(channelData)

    if (frequency) {
      pitchListeners.forEach(pitchListener => pitchListener(frequency))
    }
  }

  const addPitchListener = pitchListener => {
    if (typeof pitchListener !== 'function') {
      return
    }

    pitchListeners.push(pitchListener)
  }

  return {
    addPitchListener
  }
}
