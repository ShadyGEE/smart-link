import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'smartlink-jwt-secret-change-in-production-2024'
);

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface AuthResult {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string | null;
      jobTitle?: string | null;
      department?: string | null;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'An account with this email already exists',
          },
        };
      }

      // Hash password
      const passwordHash = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'MEMBER',
          status: 'ACTIVE',
        },
      });

      // Generate tokens
      const { accessToken, refreshToken, expiresAt } = await this.generateTokens(user.id);

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          refreshToken,
          expiresAt: new Date(expiresAt),
        },
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            jobTitle: user.jobTitle,
            department: user.department,
            role: user.role,
          },
          accessToken,
          refreshToken,
          expiresAt,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to create account. Please try again.',
        },
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        };
      }

      // Verify password
      const isValidPassword = await argon2.verify(user.passwordHash, password);

      if (!isValidPassword) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        };
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Your account is not active. Please contact support.',
          },
        };
      }

      // Generate tokens
      const { accessToken, refreshToken, expiresAt } = await this.generateTokens(user.id);

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          refreshToken,
          expiresAt: new Date(expiresAt),
        },
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            jobTitle: user.jobTitle,
            department: user.department,
            role: user.role,
          },
          accessToken,
          refreshToken,
          expiresAt,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Failed to login. Please try again.',
        },
      };
    }
  }

  async logout(token: string): Promise<{ success: boolean }> {
    try {
      await prisma.session.deleteMany({
        where: { token },
      });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: true }; // Still return success even if session deletion fails
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthResult> {
    try {
      // Find session by refresh token
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid refresh token',
          },
        };
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } });
        return {
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Session has expired. Please login again.',
          },
        };
      }

      // Generate new tokens
      const tokens = await this.generateTokens(session.userId);

      // Update session
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(tokens.expiresAt),
        },
      });

      return {
        success: true,
        data: {
          user: {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            avatar: session.user.avatar,
            jobTitle: session.user.jobTitle,
            department: session.user.department,
            role: session.user.role,
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        },
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: 'Failed to refresh token. Please login again.',
        },
      };
    }
  }

  async getSession(token: string): Promise<AuthResult> {
    try {
      // Verify JWT
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userId = payload.sub as string;

      // Find session
      const session = await prisma.session.findFirst({
        where: { token, userId },
        include: { user: true },
      });

      if (!session) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found',
          },
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            avatar: session.user.avatar,
            jobTitle: session.user.jobTitle,
            department: session.user.department,
            role: session.user.role,
          },
          accessToken: token,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt.getTime(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INVALID_SESSION',
          message: 'Invalid or expired session',
        },
      };
    }
  }

  private async generateTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }> {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExp = now + 60 * 60; // 1 hour
    const refreshTokenExp = now + 7 * 24 * 60 * 60; // 7 days

    const accessToken = await new SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(accessTokenExp)
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({ sub: userId, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(refreshTokenExp)
      .sign(JWT_SECRET);

    return {
      accessToken,
      refreshToken,
      expiresAt: accessTokenExp * 1000, // Convert to milliseconds
    };
  }
}

export const authService = new AuthService();
