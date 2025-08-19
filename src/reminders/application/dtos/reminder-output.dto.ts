import { ReminderEntity } from "../../domain/entities/reminder.entity";

export type ReminderOutput = {
    userId: string;
    channelId?: string;
    message: string;
    remindAt: Date;
    sendTo: "DM" | "CHANNEL";
    reminded?: boolean;
}

export class ReminderOutputMapper {
    static toOutput(entity: ReminderEntity):ReminderOutput {
        return entity.toJSON();
    }
}