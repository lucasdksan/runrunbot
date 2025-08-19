import { Entity } from "../../../shared/domain/entity/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";
import { ReminderValidatorFactory } from "../validators/reminder.validator";

export type ReminderProps = {
    userId: string;
    channelId?: string;
    message: string;
    remindAt: Date;
    sendTo: "DM" | "CHANNEL";
    reminded?: boolean;
    createdAt?: Date;
};

export class ReminderEntity extends Entity<ReminderProps> {
    constructor(public readonly props: ReminderProps, id?: string) {
        ReminderEntity.validate(props);
        super(props, id);

        this.props.createdAt = this.props.createdAt ?? new Date();
        this.props.reminded = this.props.reminded ?? false;
    }


    update(values: Partial<Pick<ReminderProps, "message" | "remindAt" | "sendTo" | "channelId">>): void {
        const newProps = { ...this.props, ...values };
        ReminderEntity.validate(newProps);

        if (values.message !== undefined) {
            this.message = values.message;
        }

        if (values.remindAt !== undefined) {
            this.remindAt = values.remindAt;
        }

        if (values.sendTo !== undefined) {
            this.sendTo = values.sendTo;
        }

        if (values.channelId !== undefined) {
            this.channelId = values.channelId;
        }
    }

    private set message(value: string) {
        this.props.message = value;
    }

    private set remindAt(value: Date) {
        this.props.remindAt = value;
    }

    private set sendTo(value: "DM" | "CHANNEL") {
        this.props.sendTo = value;
    }

    private set channelId(value: string | undefined) {
        this.props.channelId = value;
    }

    get userId() {
        return this.props.userId;
    }

    get channelId() {
        return this.props.channelId;
    }

    get message() {
        return this.props.message;
    }

    get remindAt() {
        return this.props.remindAt;
    }

    get sendTo() {
        return this.props.sendTo;
    }

    get reminded() {
        return this.props.reminded ?? false;
    }

    set reminded(value: boolean) {
        this.props.reminded = value;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    static validate(props: ReminderProps) {
        const validator = ReminderValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors ? validator.errors : {});
        }
    }
}