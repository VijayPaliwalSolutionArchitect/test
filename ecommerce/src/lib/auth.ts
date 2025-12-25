import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

/**
 * ===========================================
 * AUTHENTICATION CONFIGURATION
 * ===========================================
 * 
 * Supports:
 * 1. Google OAuth (SSO)
 * 2. Email/Password (Credentials)
 * 
 * TO ENABLE GOOGLE AUTH:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create OAuth 2.0 credentials
 * 3. Set authorized redirect URI to:
 *    - http://localhost:3000/api/auth/callback/google (development)
 *    - https://yourdomain.com/api/auth/callback/google (production)
 * 4. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
 */

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as NextAuthConfig['adapter'],
  
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // Email/Password Provider
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        
        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        
        if (!isValid) {
          throw new Error('Invalid email or password')
        }
        
        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        })
        
        return {
          id: user.id,
          email: user.email,
          name: user.displayName || `${user.firstName} ${user.lastName}`,
          image: user.avatar,
          role: user.role,
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role || 'CUSTOMER'
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    
    async signIn({ user, account }) {
      // Allow OAuth sign in
      if (account?.provider === 'google') {
        return true
      }
      
      // For credentials, check if user exists and is not deleted
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })
        
        if (dbUser?.isDeleted) {
          return false
        }
      }
      
      return true
    },
  },
  
  events: {
    async createUser({ user }) {
      // Generate referral code for new users
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            referralCode: `REF-${user.id.substring(0, 8).toUpperCase()}`,
          },
        })
      }
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// Helper function to get current user with full profile
export async function getCurrentUser() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
    },
  })
  
  return user
}

// Helper to check if user is admin
export async function isAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
}

// Helper to require authentication
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  
  return session
}

// Helper to require admin role
export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    throw new Error('Admin access required')
  }
  
  return session
}
