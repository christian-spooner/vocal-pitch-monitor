import React, { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
function Spectrum({ analyser }) {
    const canvasRef = React.createRef();
    const WIDTH = 720;
    const HEIGHT = 96;

    function drawBlank() {
        var canvas = canvasRef.current;
        var canvasContext = canvas.getContext('2d');
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        var drawAlt = function () {
            // eslint-disable-next-line no-unused-vars
            var drawVisual = requestAnimationFrame(drawAlt);
            canvasContext.fillStyle = '#130606';
            canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        };

        drawAlt();
    }

    function draw() {
        var canvas = canvasRef.current;
        var canvasContext = canvas.getContext('2d');
        // eslint-disable-next-line react/prop-types
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        var drawAlt = function () {
            // eslint-disable-next-line no-unused-vars
            var drawVisual = requestAnimationFrame(drawAlt);
            // eslint-disable-next-line react/prop-types
            analyser.getByteFrequencyData(dataArrayAlt);
            canvasContext.fillStyle = '#130606';
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

    useEffect(() => {
        if (!analyser) {
            drawBlank();
        } else {
            draw();
        }
    }, [analyser]);

    return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
}

export default Spectrum;
