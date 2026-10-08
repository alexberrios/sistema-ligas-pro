import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { EnrollTeamDto } from './dto/enroll-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  create(
    @Body() createTournamentDto: CreateTournamentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tournamentsService.create(createTournamentDto, user.userId);
  }

  @Get()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findAll(@CurrentUser() user: AuthUser) {
    return this.tournamentsService.findAll(user.userId);
  }

  @Get(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tournamentsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto, user.userId);
  }

  @Delete(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tournamentsService.remove(id, user.userId);
  }

  @Post(':id/teams')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  enrollTeam(
    @Param('id') tournamentId: string,
    @Body() enrollTeamDto: EnrollTeamDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tournamentsService.enrollTeam(
      tournamentId,
      enrollTeamDto,
      user.userId,
    );
  }

  @Get(':id/teams')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  getEnrolledTeams(@Param('id') tournamentId: string) {
    return this.tournamentsService.getEnrolledTeams(tournamentId);
  }
}
