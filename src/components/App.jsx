import './App.css';
import React, { useState } from 'react';

function getAutocorrolatedPitch(audioCtx, analyserNode, audioData) {
    let maximaCount = 0;
    let localMaxima = new Array(10);
    let corrolatedSignal = new Float32Array(analyserNode.fftSize);

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

    let pitch = audioCtx.sampleRate / maximaMean;
    console.log("Pitch: " + pitch);
    return pitch;
}

function getPitch(audioCtx) {
    audioCtx.resume();
    console.log("Getting pitch...");
    let microphoneStream = null;
    let analyserNode = audioCtx.createAnalyser();
    let audioData = new Float32Array(analyserNode.fftSize);
    
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            microphoneStream = audioCtx.createMediaStreamSource(stream);
            microphoneStream.connect(analyserNode);

            audioData = new Float32Array(analyserNode.fftSize);
            analyserNode.getFloatTimeDomainData(audioData);
            return getAutocorrolatedPitch(audioCtx, analyserNode, audioData);
        })
        .catch((err) => {
            console.log(err);
        });
}

function App() {
    let [recording, setRecording] = useState('Start');
    let [frequency, setFrequency] = useState(0);
    let audioCtx = new AudioContext();
    var intervalId;

    function runMonitor() 
        {
            setFrequency(getPitch(audioCtx));
        }    

    function recordHandler() {
        if (recording == 'Start') 
        {
            setRecording('Stop');
            if (intervalId) 
            {
                clearInterval(intervalId);
            }
            intervalId = setInterval(runMonitor, 1000);
        } else 
        {
            clearInterval(intervalId);
            console.log('intervalId: ' + intervalId);
            setRecording('Start');   
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
