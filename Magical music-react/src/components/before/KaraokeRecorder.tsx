import React, { useRef, useState } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";

const KaraokeRecorder: React.FC = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const sourceMic = useRef<MediaStreamAudioSourceNode | null>(null);
  const sourceSong = useRef<AudioBufferSourceNode | null>(null);
  const destination = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [songBuffer, setSongBuffer] = useState<AudioBuffer | null>(null);
  const [loadingSong, setLoadingSong] = useState(false);

  const loadSongBuffer = (file: File) => {
    setLoadingSong(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
      const arrayBuffer = reader.result as ArrayBuffer;
      try {
        const buffer = await audioContext.current.decodeAudioData(arrayBuffer);
        setSongBuffer(buffer);
      } catch (e) {
        alert("שגיאה בטעינת השיר");
      } finally {
        setLoadingSong(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSongUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioURL(null);
      loadSongBuffer(file);
    }
  };

  const startRecording = async () => {
    if (!songBuffer) {
      alert("נא להעלות שיר לפני ההקלטה");
      return;
    }

    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    sourceMic.current = audioContext.current.createMediaStreamSource(stream);

    destination.current = audioContext.current.createMediaStreamDestination();

    sourceSong.current = audioContext.current.createBufferSource();
    sourceSong.current.buffer = songBuffer;

    // חשוב! לחבר לשני היעדים:
    // ל־destination.current.stream לצורך הקלטה
    // וגם ל־audioContext.current.destination לצורך השמעה בזמן אמת
    sourceMic.current.connect(destination.current);
    sourceMic.current.connect(audioContext.current.destination);

    sourceSong.current.connect(destination.current);
    sourceSong.current.connect(audioContext.current.destination);

    sourceSong.current.start();

    mediaRecorder.current = new MediaRecorder(destination.current.stream);
    const chunks: BlobPart[] = [];
    mediaRecorder.current.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setRecording(false);

      stream.getTracks().forEach((t) => t.stop());
      sourceSong.current?.disconnect();
      sourceMic.current?.disconnect();
      destination.current?.disconnect();
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 450,
        margin: "auto",
        mt: 5,
        textAlign: "center",
        borderRadius: 3,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h5" mb={2} color="primary">
        קריוקי עם הקלטה
      </Typography>

      <Box mb={2}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleSongUpload}
          disabled={recording || loadingSong}
        />
      </Box>

      <Box mb={2}>
        <Button
          variant="contained"
          color={recording ? "error" : "primary"}
          onClick={recording ? stopRecording : startRecording}
          disabled={!songBuffer || loadingSong}
          sx={{
            px: 6,
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
          {recording ? "עצור הקלטה" : loadingSong ? "טוען שיר..." : "התחל הקלטה"}
        </Button>
      </Box>

      {audioURL && (
        <audio
          src={audioURL}
          controls
          style={{ width: "100%", borderRadius: 8, outline: "none" }}
        />
      )}
    </Paper>
  );
};

export default KaraokeRecorder;
