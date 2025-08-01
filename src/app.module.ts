import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { Module } from "@nestjs/common";
import { McpModule } from "@nestjs-mcp/server";
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module";
import { EnvConfigService } from "./shared/infrastructure/env-config/env-config.service";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { UserModule } from "./users/infrastructure/user.module";
import { TaskModule } from "./tasks/infrastructure/task.module";

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    UserModule,
    TaskModule,
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
    McpModule.forRoot({
      name: "AG.N1 MCP",
      version: "0.0.1",
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { };
