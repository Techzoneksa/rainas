import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { BrandsModule } from "./brands/brands.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { getApiRuntimeConfig } from "./config/app.config";
import { DatabaseModule } from "./database/database.module";
import { FollowsModule } from "./follows/follows.module";
import { HealthModule } from "./health/health.module";
import { ListsModule } from "./lists/lists.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PostsModule } from "./posts/posts.module";
import { ProductsModule } from "./products/products.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ReportsModule } from "./reports/reports.module";
import { SavedItemsModule } from "./saved-items/saved-items.module";
import { SettingsModule } from "./settings/settings.module";
import { UsersModule } from "./users/users.module";

const config = getApiRuntimeConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: seconds(config.rateLimitTtlSeconds),
        limit: config.rateLimitRequests
      }
    ]),
    DatabaseModule,
    HealthModule,
    UsersModule,
    ProfilesModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    PostsModule,
    CommentsModule,
    FollowsModule,
    ListsModule,
    SavedItemsModule,
    NotificationsModule,
    ReportsModule,
    SettingsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
