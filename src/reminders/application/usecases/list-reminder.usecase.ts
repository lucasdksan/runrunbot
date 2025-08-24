import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { ReminderRepository } from "../../domain/repositories/reminder.repository";
import { ReminderOutput, ReminderOutputMapper } from "../dtos/reminder-output.dto";

export namespace ListReminder {
    export type Input = {
        discordUser: string;
    };

    export type Output = ReminderOutput[];

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private reminderRepository: ReminderRepository.Repository,
        ){}
        
        async execute(input: Input): Promise<Output> {
            const { discordUser } = input;
            const userEntity = await this.userRepository.findByDiscordUser(discordUser);
            const { id: userId } = userEntity.toJSON();
            const reminders = await this.reminderRepository.findAllRemindersByUser(userId);
            const reminderFiltered = reminders.filter((reminder) => !reminder.reminded);

            return reminderFiltered.map((reminder) => ReminderOutputMapper.toOutput(reminder));
        }
    }
}