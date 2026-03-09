import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AssignPlayerDto } from './dto/assign-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  create(@Body() createTeamDto: CreateTeamDto, @CurrentUser() user: any) {
    return this.teamsService.create(createTeamDto, user.userId);
  }

  @Get()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findAll(@CurrentUser() user: any) {
    return this.teamsService.findAll(user.userId);
  }

  @Post(':id/players')
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  assignPlayer(
    @Param('id') id: string,
    @Body() assignPlayerDto: AssignPlayerDto,
    @CurrentUser() user: any
  ) {
    return this.teamsService.assignPlayer(id, assignPlayerDto, user.userId);
  }
}
