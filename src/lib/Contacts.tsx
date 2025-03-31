import React, { useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Box, ListItemIcon, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppContext } from './AppContext';
import { ChatUser } from '../fire/fire.d';
import { getChatUser, updateContacts } from '../fire/Users';
import PersonIcon from '@mui/icons-material/Person';

interface ContactsProps {
  onSelect: (chatUser: ChatUser) => void
}

const Contacts: React.FC<ContactsProps> = ({ onSelect }) => {
  const { me, meContacts, setChatUser, setMeContacts } = useContext(AppContext);

  const sortedUserNames = [...meContacts || []].sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));

  const handleListItemClick = (chatUser: ChatUser) => {
    setChatUser(chatUser);
    onSelect && onSelect(chatUser);
  };

  const handleAdd = async () => {
    const uName = window.prompt('Contact\'s User Name', '') || '';
    // Save to DB (User.updateContacts)
    if (!uName) return;
    if (meContacts?.find(c => c.userName === uName.toLowerCase())) return;

    try {
      const ExistedChatUser = await getChatUser(uName);


      if (ExistedChatUser) {
        try {
          await updateContacts(me?.userName || '', [...meContacts || [], ExistedChatUser]);
          setMeContacts(prev => [...(prev || []), ExistedChatUser]);
        } catch (error: any) {
          alert(error?.message || error);
        }

      } else {
        alert('User name does not exist.');
      }
    } catch (error) {
      alert('User name does not exist.');
    }
  }

  return (<Box display="flex"
    flexDirection="column"
    justifyContent="space-between"
    height="calc(100vh - 2em)"
    width="100%"
    p={2}
    bgcolor="background.paper">
    <List id={'messagesList'} sx={{ flexGrow: 1, overflow: 'auto' }}>
      {sortedUserNames?.map((cu) => (
        <ListItem onClick={() => handleListItemClick(cu)} key={cu?.id}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText>
            <Typography style={{ fontSize: '1.5rem', cursor: 'pointer' }} >{cu?.userName} </Typography>
          </ListItemText>
        </ListItem>
      ))}

      {sortedUserNames?.length &&
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '1em', borderTop: '1px solid grey' }}>
          <Typography>
            अपने दोस्त के साथ बिना मोबाइल नंबर के WhatsApp चैट करें। बस यूजर नेम और पासवर्ड डालकर रजिस्टर करें। कोई भी आपकी चैट नहीं देख सकता।
            मेरा यूजर आईडी roshan है। मुझे जोड़ें और मुझसे कोई भी सवाल पूछें।
          </Typography>
        </Box>}

    </List>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconButton
        style={{
          fontWeight: 'bold'
        }}
        aria-label="Add"
        onClick={handleAdd}>
        <AddIcon /> अपने मित्र की यूजर आईडी जोड़ें
      </IconButton>
    </Box>
  </Box>
  );
};

export default Contacts;
