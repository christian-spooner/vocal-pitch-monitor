import React, { useEffect } from 'react';

function WinampGraph({ analyser }) {
    const canvasRef = React.createRef();
    
    if (!analyser) {
        return null
        /* const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        var WIDTH;
		var HEIGHT;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        return (<canvas
                ref={canvasRef}
                width={640}
              height={120}
            />
        ); */
    }

  
    // Create a context from the canvas element when the component mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        var WIDTH;
		var HEIGHT;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        var drawVisual;
        var drawNoteVisual;

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

        drawAlt();
    }, []);
  
    return (
        <canvas
            ref={canvasRef}
            width={640}
            height={120}
        />
    );
}

export default WinampGraph;