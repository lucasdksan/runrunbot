import { faker } from "@faker-js/faker";
import { ReminderProps } from "../entities/reminder.entity";

type Props = {
    userId?: string;
    message?: string;
    remindAt?: Date;
    reminded?: boolean;
    createdAt?: Date;
};

export function ReminderDataBuilder(props: Props = {}): ReminderProps {
    return {
        userId: props.userId ?? faker.string.uuid(),
        message: props.message ?? faker.lorem.sentence(),
        remindAt: props.remindAt ?? faker.date.soon({ days: 3 }),
        reminded: props.reminded ?? false,
        createdAt: props.createdAt ?? new Date(),
    };
}
