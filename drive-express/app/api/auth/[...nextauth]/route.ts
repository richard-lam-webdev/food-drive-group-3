import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Recherche l'utilisateur dans la base de données
        const user = await prisma.utilisateurs.findUnique({
          where: { email: credentials?.email },
        });

        // Vérifie si le mot de passe correspond
        if (user && (await bcrypt.compare(credentials?.password || "", user.password))) {
          return { id: user.id, email: user.email, name: `${user.prenom} ${user.nom}`, role: user.role };
        }

        return null; // Retourne null si les identifiants sont incorrects
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Ajoute le rôle utilisateur à la session
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Ajoute les données utilisateur au token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Utilise JWT pour gérer les sessions
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

