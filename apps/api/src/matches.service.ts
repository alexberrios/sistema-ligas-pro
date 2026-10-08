import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateMatchDto, UpdateScoreDto } from './matches/dto/match.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    if (createMatchDto.homeTeamId === createMatchDto.awayTeamId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo');
    }

    // Verify both teams are enrolled in the tournament
    const homeEnrolled = await this.prisma.tournamentTeam.findUnique({
      where: {
        tournamentId_teamId: {
          tournamentId: createMatchDto.tournamentId,
          teamId: createMatchDto.homeTeamId,
        },
      },
    });

    const awayEnrolled = await this.prisma.tournamentTeam.findUnique({
      where: {
        tournamentId_teamId: {
          tournamentId: createMatchDto.tournamentId,
          teamId: createMatchDto.awayTeamId,
        },
      },
    });

    if (!homeEnrolled || !awayEnrolled) {
      throw new BadRequestException(
        'Ambos equipos deben estar inscritos en el torneo para programar un partido',
      );
    }

    return this.prisma.match.create({
      data: createMatchDto,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async findAllByTournament(tournamentId: string) {
    return this.prisma.match.findMany({
      where: { tournamentId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        datetime: 'asc',
      },
    });
  }

  async updateScore(matchId: string, updateScoreDto: UpdateScoreDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Partido no encontrado');
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        ...updateScoreDto,
        status: updateScoreDto.status || 'FINISHED',
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }
}
