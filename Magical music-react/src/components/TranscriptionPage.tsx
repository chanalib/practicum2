"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Box, Typography, Button, Paper, CircularProgress, TextField, Alert, IconButton } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DeleteIcon from "@mui/icons-material/Delete"

const TranscriptionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [transcription, setTranscription] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // בדיקת סוג הקובץ
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "audio/flac"]
      if (!validTypes.includes(selectedFile.type)) {
        setError("סוג קובץ לא נתמך. אנא העלה קובץ מסוג MP3, WAV, M4A, OGG או FLAC.")
        return
      }

      // בדיקת גודל הקובץ (מקסימום 25MB)
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError("גודל הקובץ חורג מ-25MB. אנא העלה קובץ קטן יותר.")
        return
      }

      setFile(selectedFile)
      setError("")
      setTranscription("")
    }
  }

  const handleTranscribe = async () => {
    if (!file) {
      setError("אנא בחר קובץ שמע לתמלול")
      return
    }

    setIsTranscribing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://singlezone-net.onrender.com/api/transcription/transcribe-full", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`שגיאה בתמלול: ${response.statusText}`)
      }

      const result = await response.json()
      setTranscription(result.text)
    } catch (error) {
      console.error("שגיאה בתמלול:", error)
      setError("אירעה שגיאה בתמלול הקובץ. אנא נסה שוב מאוחר יותר.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcription)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setFile(null)
    setTranscription("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        תמלול שירים
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        העלה קובץ שמע לתמלול אוטומטי של מילות השיר באמצעות בינה מלאכותית
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
          }}
        >
          <input
            type="file"
            accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="audio-file-input"
            ref={fileInputRef}
          />
          <label htmlFor="audio-file-input">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ mb: 2 }}>
              בחר קובץ שמע
            </Button>
          </label>

          {file && (
            <Typography variant="body2">
              נבחר: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTranscribe}
            disabled={!file || isTranscribing}
            sx={{ minWidth: 120 }}
          >
            {isTranscribing ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                מתמלל...
              </>
            ) : (
              "תמלל"
            )}
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleClear}
            disabled={isTranscribing}
            startIcon={<DeleteIcon />}
          >
            נקה
          </Button>
        </Box>
      </Paper>

      {transcription && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">תוצאות התמלול</Typography>
            <IconButton onClick={handleCopyToClipboard} color={copied ? "success" : "default"}>
              <ContentCopyIcon />
            </IconButton>
          </Box>

          <TextField
            multiline
            fullWidth
            minRows={8}
            maxRows={15}
            value={transcription}
            InputProps={{
              readOnly: true,
              sx: {
                direction: "rtl",
                textAlign: "right",
                fontFamily: "inherit",
                fontSize: "1rem",
                lineHeight: 1.8,
              },
            }}
          />

          {copied && (
            <Alert severity="success" sx={{ mt: 2 }}>
              הטקסט הועתק ללוח!
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default TranscriptionPage