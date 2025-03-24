import React, { useState } from 'react';
import { Box, TextField, IconButton, List } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import { Message } from './interfaces';
import MessageItem from './MessageItem';
import { Dialog, DialogTitle, DialogContent, } from '@mui/material';
import RecordVoice from './RecordVoice';

const Chatbox = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'text', content: input, sender: 'me', timestamp: Date.now() }]);
      setInput('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files || [];
    const timestamp = Date.now();

    for (const file of files) {
      if (file) {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
          setMessages((prev) => [...prev, { type: 'image', content: reader.result, sender: 'me', timestamp }]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleVoiceMessage = (voice: Blob) => {
    // Placeholder for voice message handling
    setMessages([...messages, { type: 'voice', content: voice, sender: 'me', timestamp: Date.now() }]);
  };

  const handleMicPress = () => {
    setIsRecording(true);
  };

  const handleStopVoiceRecord = (voice: Blob) => {
    setIsRecording(false);
    handleVoiceMessage(voice);
  };

  const handleCancelVoiceRecord = () => {
    setIsRecording(false);
  };

  return (<>
    <Box display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      width="100%"
      p={2}
      bgcolor="background.paper">
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: message.sender === 'me' ? 'end' : 'start' }}>
            <MessageItem message={message} style={{ backgroundColor: message.sender === 'me' ? '#def5df' : 'white' }} />
          </Box>
        ))}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          multiple
          onChange={handleImageUpload}
        />
        <label style={{ padding: '0px' }} htmlFor="icon-button-file">
          <IconButton style={{ padding: '0px' }} color="primary" component="span">
            <ImageIcon />
          </IconButton>
        </label>

        <IconButton style={{ padding: '0px' }} color="primary" onMouseDown={handleMicPress}>
          <MicIcon />
        </IconButton>
        <IconButton style={{ padding: '0px' }} color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
    <Dialog open={isRecording}>
      <DialogTitle display={'flex'} justifyContent={'center'}>Listening...</DialogTitle>
      <DialogContent>
        <RecordVoice autoStart={true} onStop={handleStopVoiceRecord} onCancel={handleCancelVoiceRecord} />
      </DialogContent>
    </Dialog>
  </>);
};

export default Chatbox;
