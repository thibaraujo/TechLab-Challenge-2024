import { IConsumer } from "./IConsumer.js"
import { IUser } from "./IUser.js"

export interface IConversation {
  _id: string
  subject: string
  consumer: IConsumer
  user?: IUser
}
