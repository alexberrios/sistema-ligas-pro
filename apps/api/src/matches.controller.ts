import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto, UpdateScoreDto } from './matches/dto/match.dto';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller('matches')
@UseGuards(RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles('SUPERADMIN', 'LEAGUE_ADMIN')
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get('tournament/:tournamentId')
  @Roles('SUPERADMIN', 'LEAGUE_ADMIN')
  findAllByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.findAllByTournament(tournamentId);
  }

  @Patch(':id/score')
  @Roles('SUPERADMIN', 'LEAGUE_ADMIN')
  updateScore(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.matchesService.updateScore(id, updateScoreDto);
  }
}
