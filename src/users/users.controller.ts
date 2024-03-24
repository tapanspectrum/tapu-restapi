import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) =>
  SetMetadata('response_message', message);

@ApiTags('auth')
@Controller('auths')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login Succesfully')
  async login(
    @Body('password') password: string,
    @Body('username') username: string,
    @Headers() headers,
  ) {
    // console.log('headers', headers)
    const result = await this.usersService.login(username, password);
    if (result !== null) {
      const lastlogin = await this.usersService.getLastLogindetails(
        result.id.toString(),
        headers,
      );
      console.log('lastlogin', lastlogin);
      if (lastlogin === null) {
        const respose = await this.usersService.genrateuserdata(
          result,
          headers,
        );
        return respose;
      } else {
        throw new HttpException(
          'Multiple logins has been detected, kindly logout from previous session or try again after sometime',
          HttpStatus.CONFLICT,
        );
        // return 'Multiple logins has been detected, kindly logout from previous session or try again after sometime';
      }
    } else {
      throw new UnauthorizedException('username or password wrong');
    }
  }

  @Get('/validateuser')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Employees records fetched Succesfully')
  async validateuser(@Headers('Authorization') auth: string): Promise<any> {
    try {
      return this.usersService.validateToken(auth);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // @UseGuards(AuthGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logout Succesfully !!')
  async logout(@Req() request: Request, @Headers() headers) {
    const auditUser = await this.usersService.getAuditUser(headers?.userid);
    const loUser = await this.usersService.logout(auditUser.id, auditUser);
    return loUser;
  }
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Employees records added Succesfully')
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.usersService.createUser(createUserDto);
    return result;
  }

  // @Post('/bulk')
  // @HttpCode(HttpStatus.CREATED)
  // @ResponseMessage('Employees records added Succesfully')
  // createBulk(@Body() createUserDto: CreateUserDto[]) {
  //   return this.usersService.bulkInsert(createUserDto);
  // }

  // @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Employees records fetched Succesfully')
  async findAll(@Req() request: Request, @Headers() headers) {
    console.log('Headers ', headers);
    const allUser = await this.usersService.findAllUser();
    const sortusrdaat = allUser.sort(function (x, y) {
      if (x.name < y.name) {
        return -1;
      }
      // if (x > y) {
      //   return 1;
      // }
      // return 0;
    });
    return sortusrdaat;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Employees records fetched Succesfully')
  async findOne(@Param('id') id: string) {
    const rsobj = await this.usersService.viewUser(+id);
    console.log('rsobj', rsobj);
    if (rsobj) {
      return rsobj;
    } else {
      return [];
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Employees records updated Succesfully')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // console.log('id', id);
    // console.log('updateuser', updateUserDto);
    const rsobj = await this.usersService.updateUser(+id, updateUserDto);
    // console.log('rsobj', rsobj);
    return rsobj;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Employees records Deleted Succesfully')
  remove(@Param('id') id: string) {
    const rsobj = this.usersService.removeUser(+id);
    return rsobj;
  }
}
