import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async create(createPlayerDto: CreatePlayerDto, userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
      include: { organization: true },
    });

    if (!member) {
      throw new ForbiddenException('User does not belong to any organization');
    }

    return this.prisma.player.create({
      data: {
        ...createPlayerDto,
        organizationId: member.organizationId,
      },
    });
  }

  async findAll(userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
    });
    if (!member) return [];

    return this.prisma.player.findMany({
      where: { organizationId: member.organizationId },
      orderBy: { lastName: 'asc' },
    });
  }
}
