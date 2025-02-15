export const SocketEvents = {
  MESSAGE: {
    SENT: 'messageSent',
    EDITED: 'messageEdited',
    DELETED: 'messageDeleted',
    REPLIED: 'messageReplied'
  },
  ROOM: {
    MEMBER_ADDED: 'memberAdded',
    MEMBER_REMOVED: 'memberRemoved',
    JOINED: 'joinRoom',
    LEFT: 'leaveRoom'
  }
} as const; 