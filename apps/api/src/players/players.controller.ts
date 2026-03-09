import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  create(@Body() createPlayerDto: CreatePlayerDto, @CurrentUser() user: any) {
    return this.playersService.create(createPlayerDto, user.userId);
  }

  @Get()
  @Roles(Role.LEAGUE_ADMIN, Role.SUPERADMIN)
  findAll(@CurrentUser() user: any) {
    return this.playersService.findAll(user.userId);
  }
}
