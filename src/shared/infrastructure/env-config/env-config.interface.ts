export interface EnvConfig {
    getDiscordAppId(): string;
    getDiscordPublicKey(): string;
    getDiscordToken(): string;
    getRunrunAppKey(): string;
    getRunrunUserToken(): string;
}