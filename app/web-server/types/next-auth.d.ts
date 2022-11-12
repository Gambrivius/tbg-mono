import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRoles: String[];
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: String;
      email: String;
      username: String;
      roles: String[];
    };
  }
  interface User {
    name: string;
    email: string;
    username: string;
  }
}
