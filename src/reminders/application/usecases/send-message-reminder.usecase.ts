import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordProvider } from "../../../shared/infrastructure/discord/discord.provider";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { ReminderEntity } from "../../domain/entities/reminder.entity";
import { ReminderRepository } from "../../domain/repositories/reminder.repository";
import { ReminderOutput } from "../dtos/reminder-output.dto";

export namespace SendMessageReminder {
    export type Input = {
        listReminder: ReminderOutput[];
        discordProvider: DiscordProvider;
    };

    export type Output = {
        message: string;
    };

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private reminderRepository: ReminderRepository.Repository
        ) { }

        async execute(input: Input): Promise<Output> {
            const { discordProvider, listReminder } = input;

            for (const reminder of listReminder) {
                if (this.shouldTrigger(reminder)) {
                    const userEntity = await this.userRepository.findById(reminder.userId);
                    const { discordId, discordUser } = userEntity.toJSON();

                    await discordProvider.sendDM(discordId, `Olá ${discordUser}. Você tem o seguinte lembrete:\n${reminder.message}`);

                    const updateReminder = new ReminderEntity({
                        reminded: true,
                        message: reminder.message,
                        remindAt: reminder.remindAt,
                        userId: reminder.userId,
                        createdAt: reminder.createdAt,
                    }, reminder.id);

                    await this.reminderRepository.update(updateReminder);
                }
            }

            return {
                message: "Mensagens enviadas"
            };
        }

        private shouldTrigger(reminder: ReminderOutput): boolean {
            const remindDate = new Date(reminder.remindAt);
            const now = new Date();

            return (
                remindDate.getUTCFullYear() === now.getUTCFullYear() &&
                remindDate.getUTCMonth() === now.getUTCMonth() &&
                remindDate.getUTCDate() === now.getUTCDate() &&
                remindDate.getUTCHours() === now.getUTCHours() &&
                remindDate.getUTCMinutes() === now.getUTCMinutes()
            );
        }
    }
}