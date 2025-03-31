import { addDoc, collection, getFirestore, query, where, getDocs } from 'firebase/firestore';

import { getFireApp } from './FireApp';
import { Chat, ChatUser, Me } from './fire.d';

export const getChat = async (me: Me, chatUser: ChatUser): Promise<Chat> => {
  if (!me || !chatUser) throw new Error('Chat user Name and me is required.');

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'chats');

    const queryRef = query(
      collectionRef,
      where('user1Id', 'in', [me.id, chatUser.id]),
      where('user2Id', 'in', [me.id, chatUser.id])
    );

    const docR = await getDocs(queryRef);
    if (docR.docs.length) {
      const chat = docR.docs[0].data() as Chat;

      return { ...chat, id: docR.docs[0].id };
    } else {
      //'No chat exist', create a new chat for both users
      const chat: Chat = {
        user1Id: me.id,
        user2Id: chatUser.id,
      };
      const addedChat = await addDoc(collectionRef, chat);
      return { ...chat, id: addedChat.id };
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}
