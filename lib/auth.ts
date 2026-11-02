import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordFailure, clearFailures } from "@/lib/rate-limit";
import { loginSchema } from "@/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        if (isRateLimited(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !valid) {
          recordFailure(email);
          return null;
        }

        clearFailures(email);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
