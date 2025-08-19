import { faker } from "@faker-js/faker";
import { ReminderProps } from "../entities/reminder.entity";

type Props = {
    userId?: string;
    channelId?: string;
    message?: string;
    remindAt?: Date;
    sendTo?: "DM" | "CHANNEL";
    reminded?: boolean;
    createdAt?: Date;
};

export function ReminderDataBuilder(props: Props = {}): ReminderProps {
    return {
        userId: props.userId ?? faker.string.uuid(),
        channelId: props.channelId ?? faker.string.uuid(),
        message: props.message ?? faker.lorem.sentence(),
        remindAt: props.remindAt ?? faker.date.soon({ days: 3 }),
        sendTo: props.sendTo ?? faker.helpers.arrayElement(["DM", "CHANNEL"]),
        reminded: props.reminded ?? false,
        createdAt: props.createdAt ?? new Date(),
    };
}
