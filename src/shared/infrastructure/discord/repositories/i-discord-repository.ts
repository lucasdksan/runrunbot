import { ChannelInputDto } from "../dtos/channel-input.dto";
import { MessageInputDto } from "../dtos/message-input.dto";

export interface IDiscordRepository {
    sendDM(dto: MessageInputDto): Promise<void>;
    sendChannel(dto: ChannelInputDto): Promise<void>;
    healthCheck(): Promise<boolean>;
}
