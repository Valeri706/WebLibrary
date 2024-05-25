import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

        console.log("on authorization")
        return { id: "12", email: "nice" };
      },
    }),
  ],
  secret: "CNlDBYNnOBpe6cmQyT+Ti6ti2akGx1LtGwtIWhWGPEc=",
  pages: {
    signIn: "/auth",
  },
};
