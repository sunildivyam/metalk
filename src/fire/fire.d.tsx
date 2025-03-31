export type User = {
  id?: string;
  userName?: string;
  password?: string;
  contacts?: Contacts;
};

export type Me = {
  id?: string;
  userName?: string;
};

export type ChatUser = {
  id?: string;
  userName?: string;
};

export type Contacts = ChatUser[];

export type Message = {
  id?: string;
  chatId?: string;
  userName?: string;
  type?: 'text' | 'image' | 'audio' | 'video';
  value?: string | ArrayBuffer | Blob;
  timeStamp?: number;
  sent?: boolean;
  read?: boolean;
};

export type Chat = {
  id?: string;
  user1Id?: string;
  user2Id?: string;
};
