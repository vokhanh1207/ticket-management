"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const hbs = require("express-handlebars");
const path_1 = require("path");
const session = require("express-session");
const passport = require("passport");
const helpers = require("./handlebar.helper");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.engine('hbs', hbs.engine({
        layoutsDir: (0, path_1.join)(__dirname, '..', 'views', 'layouts'),
        partialsDir: (0, path_1.join)(__dirname, '..', 'views', 'partials'),
        extname: "hbs",
        defaultLayout: "layout",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            ...helpers
        }
    }));
    app.setViewEngine('hbs');
    app.use(session({
        name: 'NESTJS_SESSION_ID',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 180 * 60 * 1000
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map