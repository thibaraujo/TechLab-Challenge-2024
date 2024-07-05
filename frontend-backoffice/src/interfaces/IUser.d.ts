export interface IUser {
  _id: string
  username: string
  email: string
  profile: string
  available: boolean
  password: string
  createdAt: string
  updatedAt: string
}
export interface IUserPayload {
  username: string;
  email: string;
  profile: string;
  available: boolean;
}
