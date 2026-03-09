import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, OrganizationsModule, TournamentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
