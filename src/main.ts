import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as session from 'express-session'
import * as passport from 'passport';
import * as helpers from './handlebar.helper'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine('hbs', hbs.engine({
    layoutsDir: join(__dirname, '..', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', 'views', 'partials'),
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
  app.use(
    session({
      name: 'NESTJS_SESSION_ID',
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 600000
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
