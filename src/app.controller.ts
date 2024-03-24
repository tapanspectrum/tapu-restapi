import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { Logger } from 'winston';

@ApiTags('')
@Controller()
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('Message', 'App Running Success !!');
    return this.appService.getHello();
  }

  @Get('myip')
  get(@RealIP() ip: string): string {
    return ip;
  }
}
