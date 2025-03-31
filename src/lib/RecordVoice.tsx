import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { Mic, Stop, Cancel } from '@mui/icons-material';
import { ReactMic, ReactMicStopEvent } from 'react-mic';
import { formatSecondsToHHMMSS } from '../Utils';

interface RecordVoiceProps {
  autoStart?: boolean;
  onStart?: () => void;
  onStop?: (recordedBlob: Blob) => void;
  onCancel?: () => void;
}
const RECORD_DURATION = 60;

const RecordVoice: React.FC<RecordVoiceProps> = ({ autoStart, onStart, onStop, onCancel }) => {
  const [recording, setRecording] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<any>(0);

  const cancelledRef = useRef(cancelled);
  const progressRef = useRef(progress);
  const timerRef = useRef(timer);


  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const stop = () => {
    setRecording(false);
    clearInterval(timerRef.current);
    setTimer(0);
  };

  useEffect(() => {
    if (recording && !timerRef.current) {
      const interval = setInterval(() => {
        const progress = progressRef.current;
        if (progress >= RECORD_DURATION) {
          stop();
        } else {
          setProgress(prev => prev + 1);
        }
      }, 1000);

      setTimer(interval);
    }
  }, [recording])

  useEffect(() => {
    if (autoStart === true) {
      setTimeout(() => setRecording(true));
    }
  }, [autoStart]);

  useEffect(() => {
    cancelledRef.current = cancelled;
    if (cancelled === true) {
      stop(); onCancel && onCancel();
    }
  }, [cancelled]);

  const handleStart = () => {
    setRecording(true);
    onStart && onStart();
  };


  const handleStop = (recordedData: ReactMicStopEvent) => {
    const recordedBlob = recordedData.blob;
    if (!cancelledRef.current && onStop) onStop(recordedBlob);
  };

  const handleStopClick = () => {
    stop();
  };

  const handleCancel = () => {
    setCancelled(true);
  };

  return (
    <Box>
      <ReactMic
        visualSetting="sinewave"
        record={recording}
        className="sound-wave"
        onStop={handleStop}
        strokeColor="rgb(46 177 159)"
        backgroundColor="#ffffff"
      />
      {recording && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant='determinate' value={progress / RECORD_DURATION * 100} />
        </Box>
      )}
      <Box>
        <Typography style={{ fontSize: '0.7em' }}>{formatSecondsToHHMMSS(progress)}</Typography>
        {!autoStart && <IconButton onClick={handleStart} disabled={recording}>
          <Mic />
        </IconButton>}
        <IconButton onClick={handleStopClick} disabled={!recording}>
          <Stop />
        </IconButton>
        <IconButton onClick={handleCancel}>
          <Cancel />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RecordVoice;
