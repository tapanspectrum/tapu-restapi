import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAuditDto {

  @IsString()
  userid: string;

  @IsString()
  ipaddress: string;

  @IsString()
  source: string;

  @IsString()
  token: string;

  @IsString()
  lastlogin: string;

  @IsString()
  module: string;

}
