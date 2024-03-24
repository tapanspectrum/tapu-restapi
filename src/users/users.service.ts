import {
  Injectable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OptimisticLockCanNotBeUsedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserAuditDto } from './dto/user-audit.dto';
import { UpdateUserAuditDto } from './dto/update-useraudit.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAudit } from './entities/user-audit.entity';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/shared/logger/services/logger.service';
// import { Observable, from, map } from 'rxjs';
const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAudit)
    private readonly userAuditRepository: Repository<UserAudit>,
    private jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.companyid = createUserDto.companyid;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    user.role = createUserDto.role;
    user.preferedlan = createUserDto.preferedlan;
    user.isactive = createUserDto.isactive;
    user.createdby = createUserDto.createdby || '';
    user.createddate = Date.now().toString();
    user.updatedby = createUserDto.updatedby || '';
    user.updateddate = Date.now().toString();
    return this.userRepository.save(user);
  }

  async genrateuserdata(user, headers): Promise<any> {
    const payload = {
      userid: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
      language: user.preferedlan,
      isactive: user.isactive,
      companyid: user.companyid,
    };
    const userToken = await this.jwtService.sign(payload);
    const auditPayload = {
      userid: user.id,
      ipaddress: headers.ipaddress || '',
      source: headers.source || '',
      token: userToken,
      module: user.role || '',
      lastlogin: Date.now().toString(),
    };
    await this.useraudit(auditPayload);
    return {
      userid: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
      token: userToken,
      language: user.preferedlan,
      isactive: user.isactive,
      companyid: user.companyid,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.getUser(username);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(username: string, password: string) {
    const validuser = await this.validateUser(username, password);
    this.logger.log('successfully login', 'usercontroller');
    if (validuser) {
      return validuser;
    } else {
      throw new UnauthorizedException();
    }
  }

  async bulkInsert(data: CreateUserDto[]) {
    const promises = data.map(async (userdata: CreateUserDto) => {
      const users: User = this.userRepository.create();
      (users.companyid = userdata.companyid),
        (users.email = userdata.email),
        (users.name = userdata.name),
        (users.username = userdata.username),
        (users.password = await bcrypt.hash(userdata.password, saltOrRounds));
      users.role = userdata.role;
      users.preferedlan = userdata.preferedlan;
      users.createdby = userdata.createdby || '';
      users.createddate = Date.now().toString();
      users.updatedby = userdata.updatedby || '';
      users.updateddate = Date.now().toString();
      const userDta = await this.userRepository.save(users);
      return userDta;
    });
    return Promise.all(promises);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllUser(): Promise<User[]> {
    return this.userRepository.find({});
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  viewUser(id: number): Promise<User> {
    // return this.userRepository.findOneBy({ id });
    return this.userRepository
      .createQueryBuilder('uod')
      .select([
        'uod.name',
        'uod.email',
        'uod.companyid',
        'uod.role',
        'uod.preferedlan',
        'uod.createdby',
        'uod.updatedby',
        'uod.createddate',
        'uod.updateddate',
        'uod.isactive',
      ])
      .where('uod.id = :id', { id: id })
      .getOne();
  }

  getUser(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.companyid = updateUserDto.companyid;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    // user.password =  await bcrypt.hash(updateUserDto.password, saltOrRounds);
    user.role = updateUserDto.role;
    user.preferedlan = updateUserDto.preferedlan;
    user.isactive = updateUserDto.isactive;
    user.createdby = updateUserDto.createdby || '';
    user.createddate = updateUserDto.createddate;
    user.updatedby = updateUserDto.updatedby || '';
    user.updateddate = Date.now().toString();
    const updateuser = this.userRepository.update(id, user);
    return updateuser;
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  validateToken(token: any): any {
    if (token?.split(' ').length > 0) {
      const btoken = token.includes('Bearer') ? token?.split(' ') : [];
      const tokenres = this.jwtService.verify(btoken[1], {
        secret: process.env.JWT_SECRET_KEY,
      });
      return tokenres;
    } else {
      throw new UnauthorizedException();
    }
  }

  async useraudit(auditUserDto: CreateUserAuditDto): Promise<any> {
    return await this.userAuditRepository.save(auditUserDto);
  }

  async getLastLogindetails(userid: string, headers: any): Promise<any> {
    const getauditdata = await this.userAuditRepository.findBy({ userid });
    if (getauditdata.length > 0) {
      const latestdata = getauditdata.reduce((a, b) => {
        return new Date(a.lastlogin) > new Date(b.lastlogin) ? a : b;
      });
      console.log('getauditdata', latestdata);
      console.log('headers.ipaddress', headers.ipaddress);
      if (latestdata.ipaddress === headers.ipaddress) {
        const tokenstatus = await this.validateLastloginToken(latestdata.token);
        if (tokenstatus) {
          return latestdata;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async validateLastloginToken(token: any) {
    try {
      if (token) {
        const tokenres = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
        return tokenres;
      }
    } catch (err) {
      if (err.message === 'jwt expired') {
        return false;
      }
    }
  }

  async getAuditUser(userid: any): Promise<any> {
    let latestdata;
    const getauditdata = await this.userAuditRepository.findBy({ userid });
    if (getauditdata.length > 0) {
      latestdata = getauditdata.reduce((a, b) => {
        return new Date(a.lastlogin) > new Date(b.lastlogin) ? a : b;
      });
      return latestdata;
    } else {
      latestdata = [];
      return latestdata;
    }
  }

  async logout(userid: any, updateaudit: UpdateUserAuditDto): Promise<any> {
    const useraudit: UserAudit = new UserAudit();
    useraudit.ipaddress = updateaudit.ipaddress;
    useraudit.lastlogin = updateaudit.lastlogin;
    useraudit.module = updateaudit.module;
    useraudit.source = updateaudit.source;
    useraudit.token = '';
    useraudit.userid = updateaudit.userid;
    const updateuser = await this.userAuditRepository.update(
      { id: userid },
      useraudit,
    );
    return updateuser;
  }
}
