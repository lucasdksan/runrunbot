import { ReminderEntity } from "../../domain/entities/reminder.entity";

export type ReminderOutput = {
    id: string;
    userId: string;
    message: string;
    remindAt: Date;
    reminded?: boolean;
    createdAt?: Date;
}

export class ReminderOutputMapper {
    static toOutput(entity: ReminderEntity):ReminderOutput {
        return entity.toJSON();
    }
}