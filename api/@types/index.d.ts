import UserModel from '../models/User';

declare global {
  namespace Express {
    interface AuthInfo {
      email: string;
      password: string;
    }

    type User = UserModel;

    interface Request {
      authInfo?: AuthInfo;
      user?: User;

      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(): void;
      logOut(): void;

      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
    }
  }
}
