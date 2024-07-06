"use client";
// components/PixelTrailCanvas.js
import { useEffect, useRef } from 'react';

const PixelTrailCanvas = ({ 
  pixelSize = 5, 
  pixelColor = '0, 0, 0', 
  fadeSpeed = 0.05,
  trailDuration = 1000 // default trail duration in milliseconds
}) => {
  const canvasRef = useRef(null);
  const pixelGridRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePixelGrid();
    };

    const initializePixelGrid = () => {
      const cols = Math.ceil(canvas.width / pixelSize);
      const rows = Math.ceil(canvas.height / pixelSize);
      pixelGridRef.current = Array.from({ length: cols }, () => Array.from({ length: rows }, () => ({ alpha: 0, lastUpdateTime: Date.now() })));
    };

    const drawPixels = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / pixelSize);
      const rows = Math.ceil(canvas.height / pixelSize);

      const now = Date.now();

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const pixel = pixelGridRef.current[x][y];
          const elapsed = now - pixel.lastUpdateTime;

          if (pixel.alpha > 0) {
            ctx.fillStyle = `rgba(${pixelColor}, ${pixel.alpha})`;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            if (elapsed > trailDuration) {
              pixel.alpha -= fadeSpeed;
            }
            if (pixel.alpha < 0) pixel.alpha = 0;
          }
        }
      }

      requestAnimationFrame(drawPixels);
    };

    const handleMouseMove = (e) => {
      const x = Math.floor(e.clientX / pixelSize);
      const y = Math.floor(e.clientY / pixelSize);

      if (pixelGridRef.current[x] && pixelGridRef.current[x][y]) {
        const pixel = pixelGridRef.current[x][y];
        pixel.alpha = 1.0;
        pixel.lastUpdateTime = Date.now(); // update the last time this pixel was active
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    resizeCanvas();
    drawPixels(); // Start drawing

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pixelSize, pixelColor, fadeSpeed, trailDuration]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} />;
};

export default PixelTrailCanvas;
