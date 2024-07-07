import { IConsumer } from "./IConsumer.js"

export interface IConversation {
  _id: string
  subject: string
  consumer: IConsumer
  deletedAt: Date
}
