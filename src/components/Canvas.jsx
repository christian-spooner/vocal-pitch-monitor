import React, { useEffect, useRef } from 'react';

const Canvas = ({ frequency }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set up canvas dimensions and clear previous drawings
        canvas.width = 1200;
        canvas.height = 800;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(0, canvas.height);
        context.lineTo(canvas.width, canvas.height);
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, canvas.height);
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(canvas.width, 0);
        context.lineTo(canvas.width, canvas.height);
        context.strokeStyle = 'white';
        context.stroke();

        // Calculate dot's y-coordinate based on frequency
        const y = 800 - frequency;

        // Draw dot at calculated y-coordinate
        context.beginPath();
        context.arc(canvas.width - 100, y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
    }, [frequency]);

    return <canvas ref={canvasRef} />;
};

export default Canvas;