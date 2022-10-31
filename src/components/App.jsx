import './App.css'
import React, { useState } from 'react'

function App() {
  let [recording, setRecording] = useState("Start");
  let [pitch, setPitch] = useState(0);
  
  function recordHandler() {
    if (recording == "Stop") {
      setRecording("Start") 
    } else {
      setRecording("Stop")
    }
    return
  }

  let recordElement = <p><button id="record" onClick={recordHandler}>{recording}</button></p>
  let pitchElement = <div id="pitch">Pitch: {pitch}</div>

  return (
    <div className="App">
      <h1>Vocal Pitch Monitor</h1>
      {recordElement}
      {pitchElement}
    </div>
  )
}

export default App
