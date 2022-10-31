// Set up the AudioContext.
const audioCtx = new AudioContext();

// Top-level variable keeps track of whether we are recording or not.
let recording = false;

// Ask user for access to the microphone.
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

    // Instantiate the media recorder.
    const mediaRecorder = new MediaRecorder(stream);

    // Create a buffer to store the incoming data.
    let chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    }

    // When you stop the recorder, create a empty audio clip.
    mediaRecorder.onstop = (event) => {
      const audio = new Audio();
      audio.setAttribute("controls", "");
      $("#sound-clip").append(audio);
      $("#sound-clip").append("<br />");

      // Combine the audio chunks into a blob, then point the empty audio clip to that blob.
      const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
      audio.src = window.URL.createObjectURL(blob);

      // Clear the `chunks` buffer so that you can record again.
      chunks = [];
    };

    // Set up event handler for the "Record" button.
    $("#record").on("click", () => {
      if (recording) {
        mediaRecorder.stop();
        recording = false;
        $("#record").html("Record");
      } else {
        mediaRecorder.start();
        recording = true;
        $("#record").html("Stop");
      }
    });

  }).catch((err) => {
    // Throw alert when the browser is unable to access the microphone.
    alert("Oh no! Your browser cannot access your computer's microphone.");
  });
} else {
  // Throw alert when the browser cannot access any media devices.
  alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
}
