import { updateDoc, addDoc, collection, getFirestore, query, where, getDocs } from 'firebase/firestore';

import { getFireApp } from './FireApp';
import { ChatUser, Contacts, User } from './fire.d';

export const isUserExist = async (userName: string): Promise<boolean> => {
  const db = getFirestore(getFireApp());
  const collectionRef = collection(db, 'users');

  const queryRef = query(collectionRef, where('userName', '==', userName.toLowerCase()));

  const docR = await getDocs(queryRef);
  if (docR.docs.length) {
    return true;
  } else {
    return false;
  }
}

export const createUser = async (user: User): Promise<User> => {
  if (!user || !user.userName) {
    throw new Error('User Name is required');
  }

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'users');
    if (await isUserExist(user.userName)) {
      throw new Error(`${user.userName} already exist. Try entering something else.`);
    }

    delete user.id;
    user.userName = user.userName.toLowerCase();
    const result = await addDoc(collectionRef, { ...user });
    return { ...user, id: result.id }
  } catch (error) {
    throw error;
  }
}

export const login = async (userName: string, password: string): Promise<User> => {
  if (!userName || !password) throw new Error('User Name and Password are required.');
  userName = userName.toLowerCase();

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'users');

    const queryRef = query(collectionRef,
      where('userName', '==', userName),
      where('password', '==', password),
    );

    const docR = await getDocs(queryRef);
    if (docR.docs.length) {
      const user = docR.docs[0].data() as User;

      return { id: docR.docs[0].id, userName: user.userName }
    } else {
      throw new Error('Invalid User name or password');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const getContacts = async (userName: string): Promise<Contacts> => {
  if (!userName) throw new Error('User Name is required.');
  userName = userName.toLowerCase();

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'users');

    const queryRef = query(collectionRef,
      where('userName', '==', userName)
    );

    const docR = await getDocs(queryRef);
    if (docR.docs.length) {
      const user = docR.docs[0].data() as User;

      return user.contacts ?? [];
    } else {
      throw new Error('Invalid User name');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}


export const getChatUser = async (userName: string): Promise<ChatUser> => {
  if (!userName) throw new Error('User Name required.');
  userName = userName.toLowerCase();

  try {
    const db = getFirestore(getFireApp());
    const collectionRef = collection(db, 'users');

    const queryRef = query(collectionRef,
      where('userName', '==', userName),
    );

    const docR = await getDocs(queryRef);
    if (docR.docs.length) {
      const user = docR.docs[0].data() as User;

      return { id: docR.docs[0].id, userName: user.userName }
    } else {
      throw new Error('Invalid User name');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}


export const updateContacts = async (userName: string, contacts: Contacts): Promise<void> => {
  if (!userName) throw new Error('User Name is required.');
  contacts = Array.from(new Set(contacts));
  const db = getFirestore(getFireApp());
  const collectionRef = collection(db, 'users');
  const queryRef = query(collectionRef, where('userName', '==', userName.toLowerCase()));
  const docR = await getDocs(queryRef);

  if (!docR.empty) {
    const docRef = docR.docs[0].ref;

    await updateDoc(docRef, {
      contacts
    });
  }
}
