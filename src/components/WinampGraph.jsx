import React, { useEffect } from 'react';

function WinampGraph({ analyser }) {
    const canvasRef = React.createRef();

    function drawBlank() {
        var canvas = canvasRef.current;
        var canvasContext = canvas.getContext('2d');
        var WIDTH;
        var HEIGHT;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
        var drawVisual;

        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        var drawAlt = function () {
            drawVisual = requestAnimationFrame(drawAlt);

            canvasContext.fillStyle = 'rgb(0, 0, 0)';
            canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        };

        drawAlt();
    }

    function draw() {
        //console.log('drawing');
        var canvas = canvasRef.current;
        var canvasContext = canvas.getContext('2d');
        var WIDTH;
        var HEIGHT;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
        var drawVisual;
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);

        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        var drawAlt = function () {
            drawVisual = requestAnimationFrame(drawAlt);

            analyser.getByteFrequencyData(dataArrayAlt);

            canvasContext.fillStyle = 'rgb(0, 0, 0)';
            canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
            var barHeight;
            var x = 0;

            for (var i = 0; i < bufferLengthAlt; i++) {
                barHeight = dataArrayAlt[i];

                canvasContext.fillStyle =
                    'rgb(' + (barHeight + 100) + ',50,50)';
                canvasContext.fillRect(
                    x,
                    HEIGHT - barHeight / 2,
                    barWidth,
                    barHeight / 2
                );

                x += barWidth + 1;
            }
        };

        drawAlt();
    }

    // Create a context from the canvas element when the component mounts
    useEffect(() => {
        if (!analyser) {
            drawBlank();
        } else {
            draw();
        }
    }, [analyser]);

    return <canvas ref={canvasRef} width={640} height={120} />;
}

export default WinampGraph;
