import { ReminderEntity } from "../../../domain/entities/reminder.entity";
import { ReminderDataBuilder } from "../../../domain/helpers/reminder-data-builder";
import { ReminderOutputMapper } from "../reminder-output.dto";

describe("ReminderOutputMapper Unit Tests", () => {
    it("should convert a ReminderEntity to ReminderOutput correctly", () => {
        const props = ReminderDataBuilder({});
        const entity = new ReminderEntity(props);
        const output = ReminderOutputMapper.toOutput(entity);

        expect(output).toStrictEqual(entity.toJSON());
        expect(output).toMatchObject({
            id: entity.id,
            userId: props.userId,
            message: props.message,
            remindAt: props.remindAt,
            reminded: props.reminded,
            createdAt: props.createdAt,
        });
    });

    it("should include optional fields when present", () => {
        const props = ReminderDataBuilder({ reminded: true, createdAt: new Date() });
        const entity = new ReminderEntity(props);

        const output = ReminderOutputMapper.toOutput(entity);

        expect(output.reminded).toBe(true);
        expect(output.createdAt).toBeInstanceOf(Date);
    });
});