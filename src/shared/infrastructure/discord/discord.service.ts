import { Injectable } from "@nestjs/common";
import { EnvConfigService } from "../env-config/env-config.service";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { MessageInputDto } from "./dtos/message-input.dto";
import { validateSync } from "class-validator";
import { ChannelInputDto } from "./dtos/channel-input.dto";
import { IDiscordRepository } from "./repositories/i-discord-repository";

@Injectable()
export class DiscordService implements IDiscordRepository {
    private client: Client;

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) {
        const token = this.envConfigService.getDiscordToken();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent
            ],
        });
        this.client.login(token);
    }

    async sendDM(dto: MessageInputDto): Promise<void> {
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

    async sendChannel(dto: ChannelInputDto): Promise<void> {
        try {
            const errors = validateSync(dto);

            if (errors.length > 0) {
                throw new Error("Dados inválidos discord service");
            }

            const { message, channelId } = dto;
            const channel = await this.client.channels.fetch(channelId);
            
            if (!channel || !channel.isTextBased()) {
                throw new Error(`O canal ${channelId} não é um canal de texto.`);
            }

            await (channel as TextChannel).send(message);
        } catch (err) {
            console.error("Erro ao enviar DM:", err);
        }
    }
}