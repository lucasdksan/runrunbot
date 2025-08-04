import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { EnvConfig } from "./env-config.interface";

@Injectable()
export class EnvConfigService implements EnvConfig {
    constructor(private readonly configService: ConfigService){}
    
    getGeminiApiKey(): string {
        return this.configService.get<string>("GEMINI_API_KEY") || "";
    }
    
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