import './App.css'

function App() {
  let pitch = 10
  const audioCtx = new AudioContext()
  let recording = false
  let recordElement = <p><button id="record">Record</button></p>
  let pitchElement = <div id="pitch"></div>

  // Ask user for access to the microphone.
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

      // Instantiate the media recorder.
      const mediaRecorder = new MediaRecorder(stream)

      // Create a buffer to store the incoming data.
      let chunks = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

    mediaRecorder.onstop = (event) => {
      const audio = new Audio()
      audio.setAttribute("controls", "")
      pitchElement.append(audio)
      pitchElement.append("<br />")

      // Combine the audio chunks into a blob, then point the empty audio clip to that blob.
      const blob = new Blob(chunks, {"type": "audio/ogg codecs=opus"})
      audio.src = window.URL.createObjectURL(blob)
      chunks = []
    }

    recordElement.on("click", () => {
      if (recording) {
        mediaRecorder.stop()
        recording = false
        recordElement.html("Record")
      } else {
        mediaRecorder.start()
        recording = true
        recordElement.html("Stop")
      }
    })

    }).catch((err) => {
      alert("Cannot access your computer's microphone.")
    })
  } else {
    alert("Cannot access your computer's microphone. Please update your browser.")
  }

  return (
    <div className="App">
      <h1>Vocal Pitch Monitor</h1>
      {recordElement}
      {pitchElement}
    </div>
  )
}

export default App
