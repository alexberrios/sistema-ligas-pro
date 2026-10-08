import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AssignPlayerDto } from './dto/assign-player.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto, userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
      include: { organization: true },
    });

    if (!member) {
      throw new ForbiddenException('User does not belong to any organization');
    }

    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        organizationId: member.organizationId,
      },
    });
  }

  async findAll(userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
    });
    if (!member) return [];

    return this.prisma.team.findMany({
      where: { organizationId: member.organizationId },
      include: {
        players: {
          include: { player: true }, // Trae la info del jugador al devolver el equipo
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignPlayer(
    teamId: string,
    assignPlayerDto: AssignPlayerDto,
    userId: string,
  ) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
    });

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) throw new NotFoundException('Team not found');
    if (member?.organizationId !== team.organizationId) {
      throw new ForbiddenException('You cannot modify this team');
    }

    // Assign player to team
    return this.prisma.teamPlayer.create({
      data: {
        teamId,
        playerId: assignPlayerDto.playerId,
        number: assignPlayerDto.number,
        position: assignPlayerDto.position,
      },
    });
  }
}
