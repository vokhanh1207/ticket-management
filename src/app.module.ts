import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './auth/user.repository';
import { OrganizersModule } from './organizers/organizers.module';
import { OrganizersService } from './organizers/organizers.service';
import { OrganizersRepository } from './organizers/organizers.repository';
import { MailSchedulesModule } from './mail-schedules/mail-schedules.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TicketsModule,
    EventsModule,
    AuthModule,
    OrganizersModule,
    MailSchedulesModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    // TypeOrmModule.forRoot(
    //   {
    //     type: 'mysql',
    //     host: 'localhost',
    //     username: 'khanhvo',
    //     password: '123456',
    //     database: 'ticket-management',
    //     autoLoadEntities: true,
    //     synchronize: true,
    //     entities: [__dirname + '/../**/*.entity.js'],
    //     extra: {
    //       "ssl": {
    //         "rejectUnauthorized": false
    //       }
    //     }
    //   }
    // ),
    // TypeOrmModule.forRoot(
    //   {
    //     type: 'mysql',
    //     host: 'localhost',
    //     username: 'backspac673d_root',
    //     password: 'Bs4X6BQMBfFXnmRxHVfS',
    //     database: 'backspac673d_ticket_management',
    //     autoLoadEntities: true,
    //     synchronize: true,
    //     entities: [__dirname + '/../**/*.entity.js'],
    //     extra: {
    //       "ssl": {
    //         "rejectUnauthorized": false
    //       }
    //     }
    //   }
    // ),
    TypeOrmModule.forRootAsync(
      {
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: 'localhost',
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_LOGIN_PASSWORD'),
          database: configService.get('DB_NAME'),
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
  providers: [AppService, AuthService, UserRepository, OrganizersService, OrganizersRepository]
})
export class AppModule { }
