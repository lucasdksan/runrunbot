import { Injectable } from "@nestjs/common";
import { EnvConfig } from "./env-config.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvConfigService implements EnvConfig {
    constructor(private readonly configService: ConfigService){}
    
    getRunrunAppKey(): string {
        return this.configService.get<string>("RUNRUN_APP_KEY") || "";
    }
    
    getRunrunUserToken(): string {
        return this.configService.get<string>("RUNRUN_USER_TOKEN") || "";
    }
    
    getDiscordAppId(): string {
        return this.configService.get<string>("DISCORD_APP_ID") || "";
    }
    
    getDiscordPublicKey(): string {
        return this.configService.get<string>("DISCORD_PUBLIC_KEY") || "";
    }
    
    getDiscordToken(): string {
        return this.configService.get<string>("DISCORD_TOKEN") || "";
    }
}