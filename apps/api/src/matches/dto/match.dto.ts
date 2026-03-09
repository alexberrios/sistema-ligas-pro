import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { MatchStatus } from '@prisma/client';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  tournamentId: string;

  @IsString()
  @IsNotEmpty()
  homeTeamId: string;

  @IsString()
  @IsNotEmpty()
  awayTeamId: string;

  @IsOptional()
  @IsDateString()
  datetime?: string;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsString()
  stage?: string;
}

export class UpdateScoreDto {
  @IsInt()
  @IsNotEmpty()
  homeScore: number;

  @IsInt()
  @IsNotEmpty()
  awayScore: number;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}
