import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { ReminderRepository } from "../../domain/repositories/reminder.repository";
import { ReminderOutput, ReminderOutputMapper } from "../dtos/reminder-output.dto";

export namespace GetAllReminder {
    export type Input = void;

    export type Output = ReminderOutput[];

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private reminderRepository: ReminderRepository.Repository,
        ){}
        
        async execute(_: Input): Promise<Output> {
            const reminders = await this.reminderRepository.findAll();
            const reminderFiltered = reminders.filter((reminder) => !reminder.reminded);

            return reminderFiltered.map((reminder) => ReminderOutputMapper.toOutput(reminder));
        }
    }
}