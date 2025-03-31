import { addDoc, collection, getFirestore, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

import { getFireApp } from './FireApp';
import { Message } from './fire.d';
import { onSnapshot } from 'firebase/firestore';

export const listenToChatMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  if (!chatId) throw new Error('Chat id is required.');

  const db = getFirestore(getFireApp());
  const collectionRef = collection(db, 'chatmessages');

  const queryRef = query(
    collectionRef,
    where('chatId', '==', chatId),
    where('sent', '==', true),
    where('read', '==', false),
  );

  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
    const sorted = messages?.sort((a, b) => (a.timeStamp || 0) - (b.timeStamp || 0));
    callback(sorted);
  });

  return unsubscribe;
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  if (!chatId) throw new Error('Chat id is required.');

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'chatmessages');

    const queryRef = query(
      collectionRef,
      where('chatId', '==', chatId),
      where('read', '==', false),
      where('sent', '==', true),
    );

    const docR = await getDocs(queryRef);
    if (docR.docs.length) {
      const msgs = docR.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
      const sorted = msgs?.sort((a, b) => (a.timeStamp || 0) - (b.timeStamp || 0));

      return sorted;
    } else {
      return [];
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const addMessage = async (chatId: string, message: Message): Promise<Message> => {
  if (!chatId || !message) throw new Error('Chat id and message is required.');

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'chatmessages');
    const toAdd = { ...message, sent: true, read: false, chatId }
    delete toAdd.id;

    switch (message.type) {
      case 'image':
        if (message.value) {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const imageUrl = await saveImage(chatId, message.value as Blob, fileName);
          toAdd.value = imageUrl;
        }
        break;
      case 'audio':
        if (message.value) {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.mp3`;
          const imageUrl = await saveAudio(chatId, message.value as Blob, fileName);
          toAdd.value = imageUrl;
        }
        break;

      default:

    }

    const docR = await addDoc(collectionRef, toAdd);
    return { ...toAdd, id: docR.id }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const saveImage = async (chatId: string, imageData: Blob, fileName: string): Promise<string> => {
  if (!imageData || !fileName) throw new Error('Image data and file name are required.');

  try {
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storage = getStorage(getFireApp());
    const ext = imageData.type.split('/')[1] || 'jpeg';
    const storageRef = ref(storage, `meribaat/${chatId}/images/${fileName}.${ext}`);
    const metadata = {
      contentType: imageData.type || 'image/jpeg',
    };

    await uploadBytes(storageRef, imageData, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};



export const saveAudio = async (chatId: string, audioData: Blob, fileName: string): Promise<string> => {
  if (!audioData || !fileName) throw new Error('Audio data and file name are required.');

  try {
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storage = getStorage(getFireApp());
    const storageRef = ref(storage, `meribaat/${chatId}/audio/${fileName}`);

    await uploadBytes(storageRef, audioData);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};


export const markMessageAsRead = async (messageId: string) => {
  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'chatmessages');

    const messageRef = doc(collectionRef, messageId);
    await updateDoc(messageRef, { read: true });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
