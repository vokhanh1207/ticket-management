"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tickets_module_1 = require("./tickets/tickets.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./auth/auth.service");
const auth_module_1 = require("./auth/auth.module");
const events_module_1 = require("./events/events.module");
const passport_1 = require("@nestjs/passport");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const user_repository_1 = require("./auth/user.repository");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            tickets_module_1.TicketsModule,
            events_module_1.EventsModule,
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule.register({
                session: true
            }),
            mailer_1.MailerModule.forRootAsync({
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('EMAIL_HOST'),
                        secure: true,
                        port: 465,
                        auth: {
                            user: configService.get('EMAIL_USERNAME'),
                            pass: configService.get('EMAIL_PASSWORD')
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, auth_service_1.AuthService, user_repository_1.UserRepository]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map