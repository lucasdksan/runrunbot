import { Module } from "@nestjs/common";
import { EnvConfigModule } from "src/shared/infrastructure/env-config/env-config.module";
import { DiscordService } from "./discord.service";
import { DiscordCommands } from "./discord.commands";

@Module({
    imports: [EnvConfigModule],
    controllers: [],
    providers: [DiscordService, DiscordCommands],
    exports: [DiscordService],
})
export class DiscordModule {};