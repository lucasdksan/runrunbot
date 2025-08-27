import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordService } from "../../../shared/infrastructure/discord/discord.service";
import { ChannelInputDto } from "../../../shared/infrastructure/discord/dtos/channel-input.dto";

export namespace MeetReminder {
    export type Input = void;

    export type Output = void;

    export class Usecase implements DefaultUseCase<Input, Output> {
        private meetURL = "https://meet.google.com/landing";
        private mainChannel = "1128392453884498093";
        
        constructor(
            private discordService: DiscordService,
        ){}
        
        async execute(_: Input): Promise<Output> {
            const dto = new ChannelInputDto();

            dto.channelId = this.mainChannel;
            dto.message = `@here DAILY\n[meet](${this.meetURL})`;

            await this.discordService.sendChannel(dto);
        }
    }
}