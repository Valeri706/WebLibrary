import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { post } from "@/lib/apiService";
import {decodeJwt} from "jose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "", type: "" },
        password: { label: "", type: "" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
        
        // @ts-ignore
        let token: string = credentials.token;
        
        if(!token)
        {
          const res = await post(
              { uri: "user/login" },
              {
                email: credentials.email,
                password: credentials.password,
              },
          );

          if (!res.ok) {
            return null;
          }

          const json = await res.json();
          token = json.token;
        }

        const jwt = decodeJwt(token);
        

        return { 
          id: jwt.id as string,
          name: jwt.name as string, 
          role: jwt.role as string,
          email: credentials.email,
          jwt: token  
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // user is only available the first time a user signs in authorized
      if (user) {
        // @ts-ignore
        return {...token, ...user,};
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      
      if (token) {
        // @ts-ignore
        session.jwt = token.jwt;
        // @ts-ignore
        session.user.role = token.role
      }

    
      return session;
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
