import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(createTournamentDto: CreateTournamentDto, userId: string) {
    // Buscar la organización del usuario activo
    const member = await this.prisma.member.findFirst({
      where: { userId },
      include: { organization: true }
    });

    if (!member) {
      throw new ForbiddenException('User does not belong to any organization');
    }

    // Crear el torneo en la organización del usuario
    return this.prisma.tournament.create({
      data: {
        ...createTournamentDto,
        organizationId: member.organizationId,
      },
    });
  }

  async findAll(userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
    });

    if (!member) return [];

    return this.prisma.tournament.findMany({
      where: { organizationId: member.organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, userId: string) {
    const member = await this.prisma.member.findFirst({
      where: { userId },
    });

    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) throw new NotFoundException('Tournament not found');
    if (member?.organizationId !== tournament.organizationId) {
       throw new ForbiddenException('You cannot access this tournament');
    }

    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto, userId: string) {
    await this.findOne(id, userId); // check permissions

    return this.prisma.tournament.update({
      where: { id },
      data: updateTournamentDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // check permissions
    
    return this.prisma.tournament.delete({
      where: { id },
    });
  }
}
