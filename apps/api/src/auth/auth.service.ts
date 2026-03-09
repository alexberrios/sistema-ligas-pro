import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterLeagueDto } from './dto/register-league.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async registerLeague(dto: RegisterLeagueDto) {
    // Check if user or organization already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { rut: dto.rut }] }
    });
    if (existingUser) throw new ConflictException('User with that email or rut already exists');

    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: dto.organizationSlug }
    });
    if (existingOrg) throw new ConflictException('Organization slug already taken');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Transaction to create user, organization, and member role
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: dto.organizationName,
          slug: dto.organizationSlug,
        }
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          rut: dto.rut,
          firstName: dto.firstName,
          lastName: dto.lastName,
        }
      });

      await tx.member.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: Role.LEAGUE_ADMIN,
        }
      });

      const payload = { sub: user.id, email: user.email, role: Role.LEAGUE_ADMIN, organizationId: org.id };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, email: user.email, role: Role.LEAGUE_ADMIN },
        organization: { id: org.id, slug: org.slug }
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { members: true }
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Default to the first member role if any (for simple token)
    const primaryMember = user.members[0];
    const role = primaryMember?.role || 'PLAYER';
    const organizationId = primaryMember?.organizationId || null;

    const payload = { sub: user.id, email: user.email, role, organizationId };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, firstName: user.firstName, role }
    };
  }
}
