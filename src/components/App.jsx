import './App.css'
import React, { useState } from 'react'

function App() {
  let [recording, setRecording] = useState("Start")
  let [pitch, setPitch] = useState(0)

  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let microphoneStream = null;
    let analyserNode = audioCtx.createAnalyser()
    let audioData = new Float32Array(analyserNode.fftSize);;
    let corrolatedSignal = new Float32Array(analyserNode.fftSize);;
    let localMaxima = new Array(10);
    const frequencyDisplayElement = document.querySelector('#frequency');

    function startPitchDetection()
    {
      navigator.mediaDevices.getUserMedia ({audio: true})
        .then((stream) =>
        {
          microphoneStream = audioCtx.createMediaStreamSource(stream);
          microphoneStream.connect(analyserNode);

          audioData = new Float32Array(analyserNode.fftSize);
          corrolatedSignal = new Float32Array(analyserNode.fftSize);

          setInterval(() => {
            analyserNode.getFloatTimeDomainData(audioData);

            let pitch = getAutocorrolatedPitch();

            frequencyDisplayElement.innerHTML = `${pitch}`;
            }, 300);
          })
        .catch((err) =>
        {
          console.log(err);
        });
    }

    function getAutocorrolatedPitch()
    {
      // First: autocorrolate the signal

      let maximaCount = 0;

      for (let l = 0; l < analyserNode.fftSize; l++) {
        corrolatedSignal[l] = 0;
        for (let i = 0; i < analyserNode.fftSize - l; i++) {
          corrolatedSignal[l] += audioData[i] * audioData[i + l];
        }
        if (l > 1) {
          if ((corrolatedSignal[l - 2] - corrolatedSignal[l - 1]) < 0
            && (corrolatedSignal[l - 1] - corrolatedSignal[l]) > 0) {
            localMaxima[maximaCount] = (l - 1);
            maximaCount++;
            if ((maximaCount >= localMaxima.length))
              break;
          }
        }
      }

    // Second: find the average distance in samples between maxima

    let maximaMean = localMaxima[0];

    for (let i = 1; i < maximaCount; i++)
      maximaMean += localMaxima[i] - localMaxima[i - 1];

    maximaMean /= maximaCount;

    return audioCtx.sampleRate / maximaMean;
  }
  
  function recordHandler() 
  {
    if (recording == "Stop") 
    {
      setRecording("Start") 
    } else {
      setRecording("Stop")
      startPitchDetection()
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
