function start() {
    console.log("starting...")
}

function init() {
    var source;
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    analyser.minDecibels = -100;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      // No audio allowed
      alert('Sorry, getUserMedia is required for the app.')
      return;
    } else {
      var constraints = {audio: true};
      navigator.mediaDevices.getUserMedia(constraints)
        .then(
          function(stream) {
            // Initialize the SourceNode
            source = audioContext.createMediaStreamSource(stream);
            // Connect the source node to the analyzer
            source.connect(analyser);
            visualize();
          }
        )
        .catch(function(err) {
          console.log(err)
          alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
        });
    }
  
    // Visualizing, copied from voice change o matic
    var canvas = document.querySelector('.visualizer');
    var canvasContext = canvas.getContext("2d");
    var WIDTH;
    var HEIGHT;
  
    function visualize() {
      WIDTH = canvas.width;
      HEIGHT = canvas.height;
  
      var drawVisual;
      var drawNoteVisual;
  
      var draw = function() {
        drawVisual = requestAnimationFrame(draw);
        analyser.fftSize = 2048;
        var bufferLength = analyser.fftSize;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
  
        canvasContext.fillStyle = 'rgb(200, 200, 200)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(0, 0, 0)';
  
        canvasContext.beginPath();
  
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
  
        for(var i = 0; i < bufferLength; i++) {
  
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;
  
          if(i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
  
        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
      }
  
      var previousValueToDisplay = 0;
      var smoothingCount = 0;
      var smoothingThreshold = 5;
      var smoothingCountThreshold = 5;
  
      // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
      var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      function noteFromPitch( frequency ) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
      }
  
      var drawNote = function() {
        drawNoteVisual = requestAnimationFrame(drawNote);
        var bufferLength = analyser.fftSize;
        var buffer = new Float32Array(bufferLength);
        analyser.getFloatTimeDomainData(buffer);
        var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate)
  
        // Handle rounding
        var valueToDisplay = autoCorrelateValue;
        var roundingValue = "none"
        if (roundingValue == 'none') {
          // Do nothing
        } else if (roundingValue == 'hz') {
          valueToDisplay = Math.round(valueToDisplay);
        } else {
          // Get the closest note
          // Thanks to PitchDetect:
          valueToDisplay = noteStrings[noteFromPitch(autoCorrelateValue) % 12];
        }
  
        var smoothingValue = "none"
  
  
        if (autoCorrelateValue === -1) {
          document.getElementById('note').innerText = 'Too quiet...';
          return;
        }
        if (smoothingValue === 'none') {
          smoothingThreshold = 99999;
          smoothingCountThreshold = 0;
        } else if (smoothingValue === 'basic') {
          smoothingThreshold = 10;
          smoothingCountThreshold = 5;
        } else if (smoothingValue === 'very') {
          smoothingThreshold = 5;
          smoothingCountThreshold = 10;
        }
        function noteIsSimilarEnough() {
          // Check threshold for number, or just difference for notes.
          if (typeof(valueToDisplay) == 'number') {
            return Math.abs(valueToDisplay - previousValueToDisplay) < smoothingThreshold;
          } else {
            return valueToDisplay === previousValueToDisplay;
          }
        }
        // Check if this value has been within the given range for n iterations
        if (noteIsSimilarEnough()) {
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
        if (typeof(valueToDisplay) == 'number') {
          valueToDisplay += ' Hz';
        }
  
        document.getElementById('note').innerText = valueToDisplay;
      }
  
      var drawFrequency = function() {
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
  
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  
        var drawAlt = function() {
          drawVisual = requestAnimationFrame(drawAlt);
  
          analyser.getByteFrequencyData(dataArrayAlt);
  
          canvasContext.fillStyle = 'rgb(0, 0, 0)';
          canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  
          var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
          var barHeight;
          var x = 0;
  
          for(var i = 0; i < bufferLengthAlt; i++) {
            barHeight = dataArrayAlt[i];
  
            canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasContext.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
  
            x += barWidth + 1;
          }
        };
  
        console.log('wut')
        drawAlt();
      }
  
      var displayValue = "sine"
      if (displayValue == 'sine') {
        draw();
      } else {
        drawFrequency();
      }
      drawNote();
    }
}
  
  
// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
function autoCorrelate(buffer, sampleRate) {
    // Perform a quick root-mean-square to see if we have enough signal
    var SIZE = buffer.length;
    var sumOfSquares = 0;
    for (var i = 0; i < SIZE; i++) {
        var val = buffer[i];
        sumOfSquares += val * val;
    }
    var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
        return -1;
    }

    // Find a range in the buffer where the values are below a given threshold.
    var r1 = 0;
    var r2 = SIZE - 1;
    var threshold = 0.2;

    // Walk up for r1
    for (var i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
        }
    }

    // Walk down for r2
    for (var i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
        }
    }

    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length

    // Create a new array of the sums of offsets to do the autocorrelation
    var c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
        }
    }

    // Find the last index where that value is greater than the next one (the dip)
    var d = 0;
    while (c[d] > c[d+1]) {
        d++;
    }

    // Iterate from that index through the end and find the maximum sum
    var maxValue = -1;
    var maxIndex = -1;
    for (var i = d; i < SIZE; i++) {
        if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
        }
    }

    var T0 = maxIndex;

    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    var x1 = c[T0 - 1];
    var x2 = c[T0];
    var x3 = c[T0 + 1]

    var a = (x1 + x3 - 2 * x2) / 2;
    var b = (x3 - x1) / 2
    if (a) {
        T0 = T0 - b / (2 * a);
    }

    return sampleRate/T0;
}