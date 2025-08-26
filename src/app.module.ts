import { NecordModule } from "necord";
import { IntentsBitField, Partials } from "discord.js";
import { Module } from "@nestjs/common"; 
import { McpModule } from "@nestjs-mcp/server";
import { ScheduleModule } from "@nestjs/schedule";
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module";
import { EnvConfigService } from "./shared/infrastructure/env-config/env-config.service";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { UserModule } from "./users/infrastructure/user.module";
import { TaskModule } from "./tasks/infrastructure/task.module";
import { ReminderModule } from "./reminders/infrastructure/reminder.module";
import { DiscordModule } from "./shared/infrastructure/discord/discord.module";

@Module({
  imports: [
    EnvConfigModule.forRoot(),
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
        partials: [Partials.Channel],
      }),
    }),
    McpModule.forRoot({
      name: "AG.N1 MCP",
      version: "0.0.1",
      instructions: "MCP to provide task descriptions for AI agents",
      logging: { level: "log", enabled: true },
      transports: { sse: { enabled: true } },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    TaskModule,
    ReminderModule,
    DiscordModule
  ],  
  controllers: [],
  providers: [],
})
export class AppModule { };
