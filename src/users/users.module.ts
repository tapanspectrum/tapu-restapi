import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, AuthController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAudit } from './entities/user-audit.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from 'src/shared/comman/interceptors/errors.interceptor';
import { LoggerService } from 'src/shared/logger/services/logger.service';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from 'src/shared/comman/guards/auth.guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAudit]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '120m' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    LoggerService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class UsersModule {}
