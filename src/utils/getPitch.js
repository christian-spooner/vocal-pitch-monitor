import * as Pitchfinder from "pitchfinder";



const myAudioBuffer = getAudioBuffer(); // assume this returns a WebAudio AudioBuffer object
const float32Array = myAudioBuffer.getChannelData(0); // get a single channel of sound

const detectPitch = Pitchfinder.AMDF();
const pitch = detectPitch(float32Array); // null if pitch cannot be identified

console.log(pitch)