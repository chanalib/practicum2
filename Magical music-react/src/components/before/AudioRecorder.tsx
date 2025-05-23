import React, { useRef, useState, useEffect } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";

const AudioRecorder: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState<boolean>(false);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    if (!analyser.current && audioContext.current) {
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setStream(stream);
      if (audioContext.current) {
        source.current = audioContext.current.createMediaStreamSource(stream);
        source.current.connect(analyser.current!);
      }
    });
  }, []);

  const draw = () => {
    if (!canvas.current || !analyser.current || !dataArray.current) return;

    const canvasCtx = canvas.current.getContext("2d");
    if (!canvasCtx) return;

    const WIDTH = canvas.current.width;
    const HEIGHT = canvas.current.height;

    analyser.current.getByteTimeDomainData(dataArray.current);

    canvasCtx.fillStyle = "#f0f0f0";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "#3f51b5";

    canvasCtx.beginPath();

    const sliceWidth = (WIDTH * 1.0) / dataArray.current.length;
    let x = 0;

    for (let i = 0; i < dataArray.current.length; i++) {
      const v = dataArray.current[i] / 128.0;
      const y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();

    requestAnimationFrame(draw);
  };

  const startRecording = () => {
    if (!stream) return;

    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      const url = URL.createObjectURL(event.data);
      setAudioURL(url);
    };
    mediaRecorder.current.start();
    setRecording(true);

    draw();
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    setRecording(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 400,
        margin: "auto",
        mt: 5,
        textAlign: "center",
        borderRadius: 3,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h5" mb={2} color="primary">
        מקליט אודיו
      </Typography>

      <Box
        sx={{
          border: "2px solid #3f51b5",
          borderRadius: 2,
          mb: 3,
          display: "inline-block",
          boxShadow: "0 0 10px rgba(63, 81, 181, 0.2)",
        }}
      >
        <canvas ref={canvas} width={350} height={120} />
      </Box>

      <Button
        variant="contained"
        color={recording ? "error" : "primary"}
        onClick={recording ? stopRecording : startRecording}
        sx={{
          mb: 3,
          px: 5,
          animation: recording
            ? "pulse 1.5s infinite"
            : "none",
          "@keyframes pulse": {
            "0%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.7)" },
            "70%": { boxShadow: "0 0 0 10px rgba(255, 0, 0, 0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0)" },
          },
        }}
      >
        {recording ? "עצור הקלטה" : "התחל הקלטה"}
      </Button>

      {audioURL && (
        <audio
          src={audioURL}
          controls
          style={{ width: "100%", outline: "none", borderRadius: 8 }}
        />
      )}
    </Paper>
  );
};

export default AudioRecorder;
