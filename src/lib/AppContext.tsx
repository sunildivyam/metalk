
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Chat, ChatUser, Contacts, Me, Message } from '../fire/fire.d';
import { getContacts } from '../fire/Users';
import { getChat } from '../fire/Chats';
import { listenToChatMessages } from '../fire/Messages';

export interface AppContextType {
  me: Me | null;
  setMe: React.Dispatch<React.SetStateAction<Me | null>>;
  meContacts: Contacts | null;
  setMeContacts: React.Dispatch<React.SetStateAction<Contacts | null>>;
  chatUser: ChatUser | null;
  setChatUser: React.Dispatch<React.SetStateAction<ChatUser | null>>;
  chat: Chat | null;
  setChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  messages: Message[] | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
}

export const AppContext = createContext<AppContextType>({
  me: null,
  setMe: () => { },
  meContacts: null,
  setMeContacts: () => { },
  chatUser: null,
  setChatUser: () => { },
  chat: null,
  setChat: () => { },
  messages: null,
  setMessages: () => { },
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [meContacts, setMeContacts] = useState<Contacts | null>(null);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);

  // Fill Contacts
  useEffect(() => {
    if (me && me.id && me.userName) {
      getContacts(me.userName).then((contacts) => {
        setMeContacts(contacts);
      }).catch(() => {
        setMeContacts([]);
      })
    } else {
      setMeContacts(null);
      setChatUser(null);
      setChat(null);
      setMessages(null);
    }
  }, [me]);

  // Fill Chat & messages
  useEffect(() => {
    if (chatUser && chatUser.id && chatUser.userName && me && me.id && me.userName) {
      getChat(me, chatUser).then((cht) => {
        setChat(cht);
        listenToChatMessages(cht.id || '', (msgs) => {
          setMessages(msgs || []);
        })
        // getChatMessages(cht.id || '').then((msgs) => {
        //   setMessages(msgs || []);
        // }).catch(() => {
        //   setMessages([]);
        // });
      }).catch(() => {
        setChat(null);
        setMessages([]);
      })
    }
  }, [chatUser]);


  return (
    <AppContext.Provider value={{
      me, setMe,
      meContacts, setMeContacts,
      chatUser, setChatUser,
      chat, setChat,
      messages, setMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};
