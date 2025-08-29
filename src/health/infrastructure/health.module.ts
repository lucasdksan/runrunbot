import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DiscordModule } from "../../shared/infrastructure/discord/discord.module";
import { EnvConfigModule } from "../../shared/infrastructure/env-config/env-config.module";
import { SqliteService } from "../../shared/infrastructure/database/sqlite/database.service";
import { CheckHealth } from "../application/usecases/check-health.usecase";
import { DiscordService } from "../../shared/infrastructure/discord/discord.service";

@Module({
  imports: [EnvConfigModule, DiscordModule],
  providers: [
    {
      provide: "SqliteService",
      useClass: SqliteService,
    },
    {
      provide: CheckHealth.Usecase,
      useFactory: (
          databaseService: SqliteService,
          discordService: DiscordService,
      ) => new CheckHealth.Usecase(databaseService, discordService),
      inject: ["SqliteService", DiscordService]
    }
  ],
  controllers: [HealthController],
})
export class HealthModule {}
