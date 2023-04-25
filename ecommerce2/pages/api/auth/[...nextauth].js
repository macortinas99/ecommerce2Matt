import NextAuth from 'next-auth/next'
import User from '../../../models/User'
import bcryptjs from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import db from '../../../utils/db'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Assigns token to user
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin
      return token
    },
    // Defines session to user
    async session({ session, token }) {
      if (token?._id) session._id = token._id
      if (token?.isAdmin) session.isAdmin = token.isAdmin
      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Connect to DB
        await db.connect()
        // Find user via email
        const user = await User.findOne({
          email: credentials.email,
        })
        await db.disconnect()
        // If password and email match sign in user
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          }
        }
        throw new Error('Invalid email or password')
      },
    }),
  ],
})
