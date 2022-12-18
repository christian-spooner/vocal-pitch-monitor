import "./App.css";
import React, { useState } from "react";
import PitchGraph from "./PitchGraph";
import Spectrum from "./Spectrum";
import autoCorrelate from "../utils/autoCorrelate";

function App() {
	let [freq, useFreq] = useState(0);
	let [analyserProp, useAnalyserProp] = useState(null);
	let [showSpectrum, useShowSpectrum] = useState(false);

	function checkSpectrum(event) {
		useShowSpectrum(event.target.checked);
	}

	function noteIsSimilarEnough(
		valueToDisplay,
		previousValueToDisplay,
		smoothingThreshold
	) {
		// Check threshold for number, or just difference for notes.
		if (typeof valueToDisplay == "number") {
			return (
				Math.abs(valueToDisplay - previousValueToDisplay) <
				smoothingThreshold
			);
		} else {
			return valueToDisplay === previousValueToDisplay;
		}
	}

	function visualize(analyser, audioContext) {
		var previousValueToDisplay = 0;
		var smoothingCount = 0;
		var smoothingThreshold = 10;
		var smoothingCountThreshold = 0;

		function draw() {
			requestAnimationFrame(draw);
			var bufferLength = analyser.fftSize;
			var buffer = new Float32Array(bufferLength);
			analyser.getFloatTimeDomainData(buffer);
			var autoCorrelateValue = autoCorrelate(
				buffer,
				audioContext.sampleRate
			);

			// Handle rounding
			var valueToDisplay = autoCorrelateValue;

			if (autoCorrelateValue === -1) {
				return -1;
			}

			// Check if this value has been within the given range for n iterations
			if (
				noteIsSimilarEnough(
					valueToDisplay,
					previousValueToDisplay,
					smoothingThreshold
				)
			) {
				if (smoothingCount < smoothingCountThreshold) {
					smoothingCount++;
					return;
				} else {
					previousValueToDisplay = valueToDisplay;
					smoothingCount = 0;
				}
			} else {
				previousValueToDisplay = valueToDisplay;
				smoothingCount = 0;
				return;
			}

			useFreq(valueToDisplay.toFixed(2));
		}

		draw();
	}

	function record() {
		var source;
		var audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		var analyser = audioContext.createAnalyser();

		analyser.minDecibels = -100;
		analyser.maxDecibels = -10;
		analyser.smoothingTimeConstant = 0.85;

		if (!navigator?.mediaDevices?.getUserMedia) {
			// No audio allowed
			console.log(navigator)
			alert("Sorry, getUserMedia is required for the app.");
			return;
		} else {
			var constraints = { audio: true };	
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(function (stream) {
					source = audioContext.createMediaStreamSource(stream);
					source.connect(analyser);
					useAnalyserProp(analyser);
					visualize(analyser, audioContext);
				})
				.catch(function (err) {
					console.log(err);
					alert(
						"Sorry, microphone permissions are required for the app"
					);
				});
		}
	}

	return (
		<div className="flex flex-col text-white">
			<div className="flex flex-col pb-2">
				<button className="py-1" onClick={record}>
					<span className="hover:text-red-600">start</span>
				</button>
				<div className="py-1 font-bold">{freq}</div>
				<label className="mx-2 text-xs py-1">
					<input
						type="checkbox"
						checked={showSpectrum}
						onChange={checkSpectrum}
						className="mr-2"
					/>
					frequency spectrum
				</label>
			</div>
			{showSpectrum && <Spectrum analyser={analyserProp} />}
			<PitchGraph frequency={freq} />
		</div>
	);
}

export default App;
