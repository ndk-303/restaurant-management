import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { LikesModule } from './modules/likes/likes.module';
import { MenuItemOptionsModule } from './modules/menu.item.options/menu.item.options.module';
import { MenuItemsModule } from './modules/menu.items/menu.items.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrderDetailsModule } from './modules/order.details/order.details.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    LikesModule,
    MenuItemOptionsModule,
    MenuItemsModule,
    MenusModule,
    OrderDetailsModule,
    OrdersModule,
    RestaurantsModule,
    ReviewsModule,
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
        inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      useFactory: async(configService: ConfigService) => ({
          transport: {
          host: 'smtp.gmail.com',
          port: 465,
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },

        // preview: true,
        template: {
          dir: join(__dirname + '/mail/templates/'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },

      }),

      inject: [ConfigService],

    }),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
