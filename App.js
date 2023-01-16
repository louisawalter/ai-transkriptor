import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop, faPlay, faDownload, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [audio, setAudio] = useState(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      });

      setRecorder(mediaRecorder);
      setIsRecording(true);
    });
  };

  const pauseRecording = () => {
    recorder.pause();
    setIsRecording(false);
    setIsPaused(true);
  };

  const continueRecording = () => {
    recorder.resume();
    setIsRecording(true);
    setIsPaused(false);
  };

  const stopRecording = () => {
    recorder.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (!audio) {
      setAudio(new Audio(audioUrl));
    }
    audio.play();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setIsStopped(true);
  };

  const downloadAudio = () => {
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audio.webm";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setAudio(null);
  }

  const transcriptAudio = () => {
    // hier wird die Audio Datei transkribiert
  }

  return (
    <div className="App">
      <h1 className="title">AI-Transkriptor</h1>
      <div>Herzlich Willkommen beim AI-Transkriptor!</div>
      <div>Hier kannst du Audio aufnehmen und direkt von der Whisper-AI transkribieren lassen.</div>
      <br/>
      <div className="container">
        <button className="button" onClick={startRecording} disabled={isRecording|| isStopped}>
          <FontAwesomeIcon icon={faMicrophone} /> Start
        </button>
        <button className="button" onClick={pauseRecording} disabled={!isRecording}>
          <FontAwesomeIcon icon={faStop} /> Pause
        </button>
        <button className="button" onClick={continueRecording} disabled={!isPaused}>
          <FontAwesomeIcon icon={faPlay} /> Continue
        </button>
        <button className="button" onClick={stopRecording} disabled={!isRecording&&!isStopped}>
          <FontAwesomeIcon icon={faStop} /> Stop
        </button>
      </div>
      <div className="container">
        <button className="button" onClick={playAudio} disabled={!audioUrl}>
          <FontAwesomeIcon icon={faPlay} /> Play
        </button>
        <button className="button" onClick={stopAudio} disabled={!isPlaying}>
          <FontAwesomeIcon icon={faStop} /> Stop
        </button>
      </div>
      <div className="container">
        <button className="button" onClick={downloadAudio} disabled={!audioUrl}>
          <FontAwesomeIcon icon={faDownload} /> Download
        </button>
        <button className="button" onClick={deleteAudio} disabled={!audioUrl}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </div>
      <br/>
      <div className="container">
        <button className="transcript" onClick={transcriptAudio} disabled={!audioUrl}>
          <FontAwesomeIcon icon={faPen} /> Transcript with Whisper
        </button>
      </div>
    </div>
  );
}
export default App;
