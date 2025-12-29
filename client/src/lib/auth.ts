import fetchClient from "@/lib/fetch-client";
import { jwt } from "@/lib/utils";
import { type NextAuthOptions, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7*24*60*60,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const response = await fetchClient({
            method: "POST",
            url: process.env.NEXT_PUBLIC_URL_API + "/api/auth/login",
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw response;
          }

          const data: { user: User; access_token: string; refresh_token: string } = await response.json();
          
          if (!data?.access_token) {
            throw response;
          }
          
          return { ...data.user, accessToken: data?.access_token, refreshToken: data?.refresh_token};
        } catch (error) {
          if (error instanceof Response) {
            return null;
          }

          throw new Error("An error has occurred during login request");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        if (session.type === "MANUAL") {
          const response = await fetchClient({
            url: process.env.NEXT_PUBLIC_URL_API + "/users/show",
            token: token.accessToken,
          });
          const user = await response.json();

          return { ...token, ...user };
        }

        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      const { exp: accessTokenExpires } = jwt.decode(token.accessToken);

      if (!accessTokenExpires) {
        return token;
      }

      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

      if (accessTokenHasExpired) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        throw new Error("Refresh token has expired");
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.name = token.name || "";
      session.user.email = token.email || "";

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      await fetchClient({
        method: "POST",
        url: process.env.NEXT_PUBLIC_URL_API + "/api/auth/logout",
        token: token.accessToken,
      });
    },
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetchClient({
      method: "POST",
      url: process.env.NEXT_PUBLIC_URL_API + "/api/auth/refresh",
      body: JSON.stringify({refreshToken: token.refreshToken}),
    });

    if (!response.ok) throw response;
    const refreshedAccessToken: { access_token: string; refresh_token: string } = await response.json();
    const { exp } = jwt.decode(refreshedAccessToken.access_token);

    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      refreshToken: refreshedAccessToken.refresh_token,
      exp,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}