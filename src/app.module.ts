import { NecordModule } from "necord";
import { Module } from "@nestjs/common";
import { IntentsBitField } from "discord.js";
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module";
import { EnvConfigService } from "./shared/infrastructure/env-config/env-config.service";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    NecordModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (envConfig: EnvConfigService) => ({
        token: envConfig.getDiscordToken(),
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.DirectMessages,
          IntentsBitField.Flags.MessageContent,
        ],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { };
