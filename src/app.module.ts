import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module";
import { NecordModule } from "necord";
import { EnvConfigService } from "./shared/infrastructure/env-config/env-config.service";
import { IntentsBitField } from "discord.js";
import { DiscordModule } from "./bots/discord/discord.module";

@Module({
  imports: [
    EnvConfigModule,
    DiscordModule,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
