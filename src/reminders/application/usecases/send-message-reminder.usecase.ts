import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordProvider } from "../../../shared/infrastructure/discord/discord.provider";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
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
        ) { }

        async execute(input: Input): Promise<Output> {
            const { discordProvider, listReminder } = input;

            const dmReminders = listReminder.filter((r) => r.sendTo === "DM" && !r.reminded);
            const channelReminders = listReminder.filter((r) => r.sendTo === "CHANNEL" && !r.reminded);

            for (const reminder of dmReminders) {
                if (this.shouldTrigger(reminder)) {
                    const userEntity = await this.userRepository.findById(reminder.userId);
                    const { discordId, discordUser } = userEntity.toJSON();

                    await discordProvider.sendDM(discordId, `Olá ${discordUser}. Você tem o seguinte lembrete:\n${reminder.message}`);
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