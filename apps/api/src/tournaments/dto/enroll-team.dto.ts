import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollTeamDto {
  @IsNotEmpty()
  @IsString()
  teamId: string;
}
