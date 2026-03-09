import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AssignPlayerDto {
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsOptional()
  number?: number;

  @IsOptional()
  @IsString()
  position?: string;
}
