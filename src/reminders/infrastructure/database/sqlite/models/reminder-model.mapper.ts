import { ValidationError } from "../../../../../shared/domain/errors/validation-error";
import { ReminderEntity } from "../../../../domain/entities/reminder.entity";

export type ReminderModelMapperInput = {
    id: string;
    userId: string;
    message: string;
    remindAt: string;
    reminded: number;
    createdAt: string;
};

export class ReminderModelMapper {
    static toEntity(model: ReminderModelMapperInput) {
        const data = {
            userId: model.userId,
            message: model.message,
            remindAt: new Date(model.remindAt),
            reminded: Boolean(model.reminded),
            createdAt: new Date(model.createdAt),
        };

        try {
            return new ReminderEntity(data, model.id);
        } catch (err) {
            throw new ValidationError("Reminder entity could not be loaded");
        }
    }
}
