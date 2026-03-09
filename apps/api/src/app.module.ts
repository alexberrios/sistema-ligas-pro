import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { MatchesModule } from './matches.module';
import { MatchesController } from './matches.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, OrganizationsModule, TournamentsModule, TeamsModule, PlayersModule, MatchesModule],
  controllers: [AppController, MatchesController],
  providers: [AppService],
})
export class AppModule {}
