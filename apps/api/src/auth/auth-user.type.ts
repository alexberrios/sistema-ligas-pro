import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  organizationId: string | null;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  organizationId: string | null;
}
