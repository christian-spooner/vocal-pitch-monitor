import './App.css';
import React, { useState } from 'react';

let monitorInterval;

function runMonitor() {
    let audioCtx = new AudioContext();
    let microphoneStream = null;
    let analyserNode = audioCtx.createAnalyser();
    let audioData = new Float32Array(analyserNode.fftSize);
    let corrolatedSignal = new Float32Array(analyserNode.fftSize);
    let localMaxima = new Array(10);

    function getAutocorrolatedPitch() {
        let maximaCount = 0;

        for (let l = 0; l < analyserNode.fftSize; l++) {
            corrolatedSignal[l] = 0;
            for (let i = 0; i < analyserNode.fftSize - l; i++) {
                corrolatedSignal[l] += audioData[i] * audioData[i + l];
            }
            if (l > 1) {
                if (
                    corrolatedSignal[l - 2] - corrolatedSignal[l - 1] < 0 &&
                    corrolatedSignal[l - 1] - corrolatedSignal[l] > 0
                ) {
                    localMaxima[maximaCount] = l - 1;
                    maximaCount++;
                    if (maximaCount >= localMaxima.length) break;
                }
            }
        }

        let maximaMean = localMaxima[0];

        for (let i = 1; i < maximaCount; i++)
            maximaMean += localMaxima[i] - localMaxima[i - 1];

        maximaMean /= maximaCount;

        return audioCtx.sampleRate / maximaMean;
    }

    function getPitch() {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                microphoneStream = audioCtx.createMediaStreamSource(stream);
                microphoneStream.connect(analyserNode);

                audioData = new Float32Array(analyserNode.fftSize);
                corrolatedSignal = new Float32Array(analyserNode.fftSize);
                analyserNode.getFloatTimeDomainData(audioData);
                return getAutocorrolatedPitch();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return getPitch();
}

function App() {
    let [recording, setRecording] = useState('Start');
    let [frequency, setFrequency] = useState(0);

    function recordHandler() {
        if (recording == 'Stop') {
            clearInterval(monitorInterval);
            monitorInterval = null;
            setRecording('Start');
        } else {
            setRecording('Stop');
            if (!monitorInterval) 
            {
                monitorInterval = setInterval(runMonitor, 1000);
            }
        }
        return;
    }

    let recordElement = (
        <p>
            <button id="record" onClick={recordHandler}>
                {recording}
            </button>
        </p>
    );
    let frequencyElement = <div id="pitch">{frequency}</div>;

    return (
        <div className="App">
            <h1>Vocal Pitch Monitor</h1>
            {recordElement}
            {frequencyElement}
        </div>
    );
}

export default App;
