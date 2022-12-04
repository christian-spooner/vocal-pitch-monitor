import './App.css';
import React, { useState } from 'react';

function App() {
    let [start, useStart] = useState("start")
    function startRecording() {
        if (start == "start") {
            useStart("stop")
            var source;
            var audioContext = new window.AudioContext();
            var analyser = audioContext.createAnalyser();
        
            analyser.minDecibels = -100;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.85;
        
            if (!navigator?.mediaDevices?.getUserMedia) {
                alert('Sorry, getUserMedia is required for the app.')
            } else {
                var constraints = {audio: true};
                navigator.mediaDevices.getUserMedia(constraints)
                    .then(
                        function(stream) {
                            // Initialize the SourceNode
                            source = audioContext.createMediaStreamSource(stream);
                            // Connect the source node to the analyzer
                            source.connect(analyser);
                        }
                    )
                    .catch(function(err) {
                        alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
                    });
            }
        } else {
            useStart("start")
        }
    }

    return (
        <button onClick={startRecording}>{start}</button>
    )
}

export default App;
