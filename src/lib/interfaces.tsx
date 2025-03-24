interface BaseMessage {
  timestamp: number;
  sender: string;
  sent?: boolean;
  read?: boolean;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

export interface ImageMessage extends BaseMessage {
  type: 'image';
  content: string | ArrayBuffer | null;
}

export interface VoiceMessage extends BaseMessage {
  type: 'voice';
  content: Blob;
}

export type Message = TextMessage | ImageMessage | VoiceMessage;
