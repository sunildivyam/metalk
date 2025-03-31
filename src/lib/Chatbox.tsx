import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, IconButton, List } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import MessageItem from './MessageItem';
import { Dialog, DialogTitle, DialogContent, } from '@mui/material';
import RecordVoice from './RecordVoice';
import { AppContext } from './AppContext';
import { addMessage, markMessageAsRead } from '../fire/Messages';
import { Message } from '../fire/fire.d';

const FADE_AWAY_TIME = 90 * 1000;

const Chatbox = () => {
  const { messages, setMessages, chat, me, chatUser } = useContext(AppContext);

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      const list = document.querySelector('ul#messagesList');
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    });
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const messageId = (entry.target as HTMLElement).id || '';

          setTimeout(() => {
            if (messageId && !messages?.find(m => m.id === messageId)?.read) {
              markMessageAsRead(messageId);
            }
          }, FADE_AWAY_TIME);
        }
      });
    }, { threshold: 0.8 });

    const messageElements = document.querySelectorAll(".chat-user-message");
    messageElements.forEach(msg => observer.observe(msg));

    return () => observer.disconnect();
  }, [messages]);  // Run this effect when messages update

  const saveMessage = (msg: Message) => {
    setMessages(prev => ([...prev || [], msg]));
    addMessage(chat?.id || '', msg)
      .then(savedMsg => {
        setMessages(prev => prev?.map(m => m.timeStamp === savedMsg.timeStamp ? savedMsg : m) || []);
      })
      .catch(err => {
        console.error('Failed to save message:', err);
      });
  }

  const handleSendMessage = () => {
    if (input.trim()) {
      const msg: Message = { type: 'text', value: input, chatId: chat?.id, userName: me?.userName, timeStamp: Date.now(), read: false, sent: false };
      saveMessage(msg);
      setInput('');
      scrollToBottom();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files || [];
    const timeStamp = Date.now();

    for (const file of files) {
      if (file) {
        // Convert file to Blob
        const blob = new Blob([file], { type: file.type });
        const msg: Message = { type: 'image', value: blob, chatId: chat?.id, userName: me?.userName, timeStamp, read: false, sent: false };
        saveMessage(msg);
        scrollToBottom()
        // const reader: FileReader = new FileReader();
        // reader.onload = () => {
        //   if (reader.result) {
        //     const msg: Message = { type: 'image', value: reader.result, chatId: chat?.id, userName: me?.userName, timeStamp, read: false, sent: false };
        //     saveMessage(msg);
        //   }
        // };
        // reader.readAsDataURL(file);
      }
    }
  };

  const handleVoiceMessage = (voice: Blob) => {
    const msg: Message = { type: 'audio', value: voice, chatId: chat?.id, userName: me?.userName, timeStamp: Date.now(), read: false, sent: false };
    saveMessage(msg);
    scrollToBottom();
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
      height="calc(100vh - 4em)"
      width="100%"
      p={2}
      bgcolor="background.paper">
      <List id={'messagesList'} sx={{ flexGrow: 1, overflow: 'auto' }}>
        {messages?.map((message, index) => (
          <Box
            id={message.id}
            key={index}
            className={message.userName === chatUser?.userName ? 'chat-user-message' : 'me-message'}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.userName === me?.userName ? 'end' : 'start',
            }}
          >
            <MessageItem
              message={message}
              style={{
                backgroundColor: message.userName === me?.userName ? '#def5df' : 'white',
              }}
            />
          </Box>
        ))}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center' }} >
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
