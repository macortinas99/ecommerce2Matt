import NextAuth from 'next-auth/next'

export default NextAuth({
  sessoin: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._ud = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin
      return token
    },

    async session({ session, token }) {
      if (token?._id) session._ud = token._id
      if (token?.isAdmin) session.isAdmin = token.isAdmin
      return session
    },
  },
})
