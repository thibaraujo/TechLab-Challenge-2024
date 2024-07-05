export interface IUser {
  _id: string
  username: string
  email: string
  profile: string
  password: string
  createdAt: string
  updatedAt: string
}
export interface IUserPayload {
  username: string;
  email: string;
  profile: string;
}
