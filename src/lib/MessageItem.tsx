import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { Message } from './interfaces';
import { formatTimestampToHHMM } from '../Utils';

interface MessageItemProps {
  message: Message;
  style?: React.CSSProperties
}

const MessageItem: React.FC<MessageItemProps> = ({ message, style }) => {
  return (
    <Card style={{ margin: '0.5em', padding: '0.5em', maxWidth: '80%', ...style }}>
      <CardContent style={{ padding: '0px' }}>
        {message.type === 'text' && (
          <Typography variant="body1">{message.content}</Typography>
        )}
        {message.type === 'image' && (
          <CardMedia
            component="img"
            image={typeof message.content === 'string' ? message.content : ''}
            alt="Image message"
          />
        )}
        {message.type === 'voice' && message.content && (

          <audio controls style={{ width: '200px' }}>
            <source src={URL.createObjectURL(message.content)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <Box display="flex"
          flexDirection="row"
          justifyContent="end">
          <Typography variant="subtitle2" color="textSecondary" style={{ textAlign: 'right', fontSize: '0.5em' }}>
            {formatTimestampToHHMM(message.timestamp)}
          </Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            {!message.sent && <Typography style={{ marginLeft: '0.5em', fontSize: '0.7em' }} variant="subtitle2" color="textSecondary">✔</Typography>}
            {message.sent && !message.read && (
              <Typography style={{ marginLeft: '0.5em', fontSize: '0.7em' }} variant="subtitle2" color="textSecondary">✔✔</Typography>
            )}
            {message.read && (
              <Typography style={{ marginLeft: '0.5em', fontSize: '0.7em' }} variant="subtitle2" color="primary">✔✔</Typography>
            )}
          </Box>
        </Box>

      </CardContent>
    </Card>
  );
};

export default MessageItem;
