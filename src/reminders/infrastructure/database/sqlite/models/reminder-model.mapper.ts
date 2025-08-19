import { ValidationError } from "../../../../../shared/domain/errors/validation-error";
import { ReminderEntity } from "../../../../domain/entities/reminder.entity";

export type ReminderModelMapperInput = {
    id: string;
    userId: string;
    channelId?: string | null;
    message: string;
    remindAt: string;
    sendTo: "DM" | "CHANNEL";
    reminded: number;
    createdAt: string;
};

export class ReminderModelMapper {
    static toEntity(model: ReminderModelMapperInput) {
        const data = {
            userId: model.userId,
            channelId: model.channelId ?? undefined,
            message: model.message,
            remindAt: new Date(model.remindAt),
            sendTo: model.sendTo,
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
