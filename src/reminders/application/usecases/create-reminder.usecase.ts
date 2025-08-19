import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { ReminderEntity } from "../../domain/entities/reminder.entity";
import { ReminderRepository } from "../../domain/repositories/reminder.repository";
import { ReminderOutput, ReminderOutputMapper } from "../dtos/reminder-output.dto";

export namespace CreateReminder {
    export type Input = {
        discordUser: string;
        channelId?: string;
        message: string;
        remindAt: Date;
        sendTo: "DM" | "CHANNEL";
        reminded?: boolean;
    };

    export type Output = ReminderOutput;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private reminderRepository: ReminderRepository.Repository,
        ){}
        
        async execute(input: Input): Promise<Output> {
            const { discordUser, ...props } = input;
            const userEntity = await this.userRepository.findByDiscordUser(discordUser);
            const { id: userId } = userEntity.toJSON();
            const reminder = new ReminderEntity({
                userId,
                ...props
            });
            
            await this.reminderRepository.insert(reminder);

            return ReminderOutputMapper.toOutput(reminder);
        }
    }
}