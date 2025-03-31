import './App.css'
import Chatbox from './lib/Chatbox'
import LoginUser from './lib/LoginUser'
import RegisterUser from './lib/RegisterUser'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useContext, useEffect, useState } from 'react';
import Contacts from './lib/Contacts'
import { AppContext } from './lib/AppContext';

function App() {
  const { me, setMe, chatUser } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [showContacts, setShowContacts] = useState<boolean>(false);

  const handleLogout = () => {
    setMe(null);
    setShowLogin(true);
  };

  const handleShowContacts = () => {
    setShowContacts(true);
  }

  useEffect(() => {
    setShowContacts(true);
  }, [me])

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MeriBaat
          </Typography>
          {chatUser && !showContacts && <Typography component="div" sx={{ flexGrow: 1 }}>
            {chatUser.userName}
          </Typography>}

          {showContacts && <Typography component="div" sx={{ flexGrow: 1 }}>
            Your Contacts
          </Typography>}

          {!me && <IconButton color="inherit" onClick={() => setShowLogin(true)}>
            <PersonIcon />
          </IconButton>}

          {me && !showContacts && <IconButton color="inherit" onClick={handleShowContacts}>
            <ArrowBackIcon />
          </IconButton>}

          {me && <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>}

        </Toolbar>
      </AppBar>
      {!me && <>
        {
          showLogin && <><LoginUser />
            <Typography variant="body2" component="div" sx={{ cursor: 'pointer', color: 'blue', textAlign: 'center', mt: '1em' }} onClick={() => setShowLogin(false)}>
              New user? Register
            </Typography></>
        }
        {!showLogin && <>
          <RegisterUser />
          <Typography variant="body2" component="div" sx={{ cursor: 'pointer', color: 'blue', textAlign: 'center', mt: '1em' }} onClick={() => setShowLogin(true)}>
            Already a user? Login
          </Typography>
        </>
        }
      </>}

      {me && !showContacts && <Chatbox></Chatbox>}

      {me && showContacts && <Contacts onSelect={() => setShowContacts(false)} />}
    </>
  )
}

export default App
