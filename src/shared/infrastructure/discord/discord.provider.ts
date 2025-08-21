import { Client, GatewayIntentBits } from "discord.js";

export class DiscordProvider {
    private client: Client;

    constructor(token: string) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
            ],
        });

        this.client.login(token);
    }

    async sendDM(userId: string, message: string): Promise<void> {
        try {
            const user = await this.client.users.fetch(userId);

            if (!user) throw new Error(`Usuário ${userId} não encontrado.`);
            
            await user.send(message);
        } catch (err) {
            console.error("Erro ao enviar DM:", err);
        }
    }
}