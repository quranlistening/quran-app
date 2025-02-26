import React, { useEffect, useRef } from "react";

const LiveMicVisualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let dataArray;
    let animationId;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 64;

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        microphone.connect(analyser);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const barWidth = 1; // Set a fixed bar width

        const draw = () => {
          animationId = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#11121B";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            ctx.fillStyle = `#2E806D`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 2;
          }
        };

        draw();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    startMic();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="60"
      height="20"
    ></canvas>
  );
};

export default LiveMicVisualizer;
