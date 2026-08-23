export interface IUser {
  _id: string
  userName: string;
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  API_KEY: string
  role: string;
}