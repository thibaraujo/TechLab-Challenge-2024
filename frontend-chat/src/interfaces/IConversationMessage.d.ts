export interface IConversationMessage {
  _id: string
  content: string
  by: 'consumer' | 'system' | 'user'
  createdAt: string
}