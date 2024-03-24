import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  //   IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;
export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsString()
  companyid: string;

  @IsString()
  country: string;

  @IsString()
  @IsEnum(['Business', 'Analytics', 'Developer', 'SME', 'Vendor', 'Admin'])
  role: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  password: string;

  @ApiProperty()
  @IsString()
  preferedlan: string;

  @IsString()
  createdby: string;

  @IsString()
  updatedby: string;

  @IsString()
  createddate: string;

  @IsString()
  updateddate: string;

  @ApiProperty()
  @IsBoolean()
  isactive: boolean;
}
