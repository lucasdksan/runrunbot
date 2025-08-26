import { Injectable } from "@nestjs/common";
import { EnvConfigService } from "../env-config/env-config.service";
import { Client, GatewayIntentBits } from "discord.js";
import { MessageInputDto } from "./dtos/message-input.dto";
import { validateSync } from "class-validator";

@Injectable()
export class DiscordService {
    private client: Client;

    constructor(
        private readonly envConfigService: EnvConfigService,
    ){
        const token = this.envConfigService.getDiscordToken();
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
            ],
        });
        this.client.login(token);
    }

    async sendDM(dto: MessageInputDto): Promise<void>{
        try {
            const errors = validateSync(dto);
            
            if (errors.length > 0) {
                throw new Error("Dados inválidos discord service");
            }

            const { message, userId } = dto;
            const user = await this.client.users.fetch(userId);

            if (!user) throw new Error(`Usuário ${userId} não encontrado.`);
            
            await user.send(message);
        } catch (err) {
            console.error("Erro ao enviar DM:", err);
        }
    }
}