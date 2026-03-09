import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  create(@Body() createTournamentDto: CreateTournamentDto, @CurrentUser() user: any) {
    return this.tournamentsService.create(createTournamentDto, user.userId);
  }

  @Get()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findAll(@CurrentUser() user: any) {
    return this.tournamentsService.findAll(user.userId);
  }

  @Get(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tournamentsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto, @CurrentUser() user: any) {
    return this.tournamentsService.update(id, updateTournamentDto, user.userId);
  }

  @Delete(':id')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tournamentsService.remove(id, user.userId);
  }
}
