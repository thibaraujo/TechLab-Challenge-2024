export interface IConversationMessage {
  id: string
  content: string
  by: 'consumer' | 'system' | 'user'
  createdAt: string
  type: ConversationType
  fileId: string
}

export enum ConversationType {
  FILE = "FILE",
  TEXT = "TEXT"
}