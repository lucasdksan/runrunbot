import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordService } from "../../../shared/infrastructure/discord/discord.service";
import { MessageInputDto } from "../../../shared/infrastructure/discord/dtos/message-input.dto";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { ReminderEntity } from "../../domain/entities/reminder.entity";
import { ReminderRepository } from "../../domain/repositories/reminder.repository";
import { ReminderOutput } from "../dtos/reminder-output.dto";

export namespace SendMessageReminder {
    export type Input = {
        listReminder: ReminderOutput[];
    };

    export type Output = {
        message: string;
    };

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private reminderRepository: ReminderRepository.Repository,
            private discordService: DiscordService,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { listReminder } = input;

            for (const reminder of listReminder) {
                if (ReminderEntity.shouldTrigger(reminder)) {
                    const userEntity = await this.userRepository.findById(reminder.userId);
                    const { discordId, discordUser } = userEntity.toJSON();
                    const dto = new MessageInputDto();

                    dto.userId = discordId;
                    dto.message = `Olá ${discordUser}. Você tem o seguinte lembrete:\n${reminder.message}`;
                    await this.discordService.sendDM(dto);

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
    }
}