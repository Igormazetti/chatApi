export interface Message {
  id: number;
  sender_id: number;
  receiver_id?: number;
  text: string;
  replyTo?: number;
  created_at: Date;
  room_id: number;
} 