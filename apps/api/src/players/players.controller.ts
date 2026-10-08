import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  create(
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.playersService.create(createPlayerDto, user.userId);
  }

  @Get()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findAll(@CurrentUser() user: AuthUser) {
    return this.playersService.findAll(user.userId);
  }
}
