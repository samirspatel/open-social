import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string
    user: {
      githubId?: string
    } & DefaultSession['user']
  }
  
  interface JWT {
    accessToken?: string
    githubId?: string
  }
}
