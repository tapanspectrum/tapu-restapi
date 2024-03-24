import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { instance } from './shared/comman';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger({
    //   instance: instance,
    // }),
    // logger: ['debug', 'error', 'fatal', 'log', 'warn'],
    logger: WinstonModule.createLogger({
      transports: [
        // let's log errors into its own file
        new transports.File({
          filename: `logs/error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        // logging all level
        new transports.File({
          filename: `logs/combined.log`,
          format: format.combine(format.timestamp(), format.json()),
        }),
        // we also want to see logs in our console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  app.enableCors({
    origin: true,
    methods: 'GET, POST',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('MicroServices API')
    .setDescription('The MicroServices API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     disableErrorMessages: true,
  //     forbidUnknownValues: true,
  //   }),
  // );
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
