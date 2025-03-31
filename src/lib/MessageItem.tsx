import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, Box, Dialog, DialogContent } from '@mui/material';
import { Message } from '../fire/fire.d';
import { formatTimestampToHHMM } from '../Utils';

interface MessageItemProps {
  message: Message;
  style?: React.CSSProperties
}

const MessageItem: React.FC<MessageItemProps> = ({ message, style }) => {
  const [open, setOpen] = useState(false);

  const isUrl = (value?: string | ArrayBuffer | Blob): boolean => {
    if (typeof value === 'string') {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const toValue = (value?: string | ArrayBuffer | Blob): string | ArrayBuffer | Blob | undefined => {
    if (isUrl(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value;
    } else {
      return URL.createObjectURL(value as Blob);
    }
  }

  return (<>
    <Card style={{ margin: '0.5em', padding: '0.5em', maxWidth: '80%', ...style }}>
      <CardContent style={{ padding: '0px' }}>
        {message.type === 'text' && (
          <Typography variant="body1">{message.value as string}</Typography>
        )}
        {message.type === 'image' && (

          <CardMedia
            component="img"
            image={toValue(message.value) as string}
            src={toValue(message.value) as string}
            alt="Image message"
            onClick={() => setOpen(true)}
            style={{ cursor: 'pointer' }}
          />
        )}

        {message.type === 'audio' && message.value && (

          <audio controls style={{ width: '200px' }}>
            <source src={toValue(message.value) as string} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <Box display="flex"
          flexDirection="row"
          justifyContent="end">
          <Typography variant="subtitle2" color="textSecondary" style={{ textAlign: 'right', fontSize: '0.5em' }}>
            {formatTimestampToHHMM(message.timeStamp)}
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
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
      <Box display="flex" justifyContent="flex-end" padding="0.5em">
        <Typography
          component="button"
          onClick={() => setOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em',
            lineHeight: '1',
          }}
        >
          &times;
        </Typography>
      </Box>
      <DialogContent style={{ padding: 0 }}>
        <CardMedia
          component="img"
          image={toValue(message.value) as string}
          src={toValue(message.value) as string}
          alt="Image message"
        />
      </DialogContent>
    </Dialog>
  </>
  );
};

export default MessageItem;
