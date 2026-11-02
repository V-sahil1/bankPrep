import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/register"];

/** Prisma-free config shared with proxy.ts. Full auth lives in lib/auth.ts. */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isPublic = PUBLIC_PATHS.includes(nextUrl.pathname);
      if (isPublic) {
        return isLoggedIn ? Response.redirect(new URL("/dashboard", nextUrl)) : true;
      }
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
