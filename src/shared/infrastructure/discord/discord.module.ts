import { Module } from "@nestjs/common";
import { EnvConfigModule } from "../env-config/env-config.module";
import { DiscordService } from "./discord.service";

@Module({
    imports: [EnvConfigModule],
    providers: [DiscordService],
    exports: [DiscordService],
})
export class DiscordModule {}