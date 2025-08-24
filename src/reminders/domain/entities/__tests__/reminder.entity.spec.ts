import { ReminderDataBuilder } from "../../helpers/reminder-data-builder";
import { ReminderEntity, ReminderProps } from "../reminder.entity";

describe("ReminderEntity unit tests", () => {
    let props: ReminderProps;
    let sut: ReminderEntity;

    beforeEach(() => {
        ReminderEntity.validate = jest.fn();
        props = ReminderDataBuilder({});
        sut = new ReminderEntity(props);
    });

    it("Constructor Method", () => {
        expect(ReminderEntity.validate).toHaveBeenCalled();
        expect(sut.props.userId).toEqual(props.userId);
        expect(sut.props.message).toEqual(props.message);
        expect(sut.props.remindAt).toBeInstanceOf(Date);
        expect(sut.props.reminded).toBe(false);
        expect(sut.props.createdAt).toBeInstanceOf(Date);
    });

    it("Getter of userId field", () => {
        expect(sut.userId).toBeDefined();
        expect(sut.userId).toEqual(props.userId);
        expect(typeof sut.props.userId).toBe("string");
    });

    it("Getter of message field", () => {
        expect(sut.message).toBeDefined();
        expect(sut.message).toEqual(props.message);
        expect(typeof sut.props.message).toBe("string");
    });

    it("Setter of message field", () => {
        sut["message"] = "Novo lembrete importante";
        expect(sut.message).toEqual("Novo lembrete importante");
    });

    it("Getter of remindAt field", () => {
        expect(sut.remindAt).toBeDefined();
        expect(sut.remindAt).toBeInstanceOf(Date);
    });

    it("Setter of remindAt field", () => {
        const newDate = new Date(Date.now() + 3600 * 1000);
        sut["remindAt"] = newDate;
        expect(sut.remindAt).toEqual(newDate);
    });

    it("Getter and Setter of reminded field", () => {
        expect(sut.reminded).toBe(false);
        sut.reminded = true;
        expect(sut.reminded).toBe(true);
    });

    it("Should update a reminder (message)", () => {
        expect(ReminderEntity.validate).toHaveBeenCalled();
        sut.update({ message: "Reunião com time às 15h" });
        expect(sut.message).toEqual("Reunião com time às 15h");
    });

    it("Should update a reminder (remindAt)", () => {
        const newDate = new Date(Date.now() + 7200 * 1000);
        sut.update({ remindAt: newDate });
        expect(sut.remindAt).toEqual(newDate);
    });

    it("Getter of createdAt field", () => {
        expect(sut.createdAt).toBeDefined();
        expect(sut.createdAt).toBeInstanceOf(Date);
    });
});
