import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';
import { EventsController } from './events/events.controller';
import { TicketsService } from './tickets/tickets.service';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './auth/user.repository';

@Module({
  imports: [
    TicketsModule,
    EventsModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    // TypeOrmModule.forRoot(
    //   {
    //     type: 'postgres',
    //     host: 'localhost',
    //     port: 5432,
    //     username: 'postgres',
    //     password: '123456',
    //     database: 'tickets-management',
    //     autoLoadEntities: true,
    //     synchronize: true,
    //     entities: [__dirname + '/../**/*.entity.js']
    //   }
    // ),
    TypeOrmModule.forRootAsync(
      {
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: 'dpg-csn4cq9u0jms7380mtug-a.singapore-postgres.render.com',
          port: 5432,
          username: 'tickets_management_user',
          password: configService.get('DB_PASSWORD'),
          database: 'tickets_management',
          autoLoadEntities: true,
          synchronize: true,
          entities: [__dirname + '/../**/*.entity.js'],
          extra: {
            "ssl": {
              "rejectUnauthorized": false
            }
          }
        }),
        inject: [ConfigService],
    }),
    PassportModule.register({
      session: true
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          // For relay SMTP server set the host to smtp-relay.gmail.com
          // and for Gmail STMO server set it to smtp.gmail.com
          host: configService.get('EMAIL_HOST'),
          // For SSL and TLS connection
          secure: true,
          port: 465,
          auth: {
            // Account gmail address
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD')
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UserRepository]
})
export class AppModule { }
